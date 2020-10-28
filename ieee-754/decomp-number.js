/*
	IEEE754
	Float64
	3              3               2               1               0
	FEDCBA9876543210FEDCBA9876543210FEDCBA9876543210FEDCBA9876543210
	6  6         5         4       3 3         2   1     1         0
	3210987654321098765432109876543210987654321098765432109876543210
	----------------------------------------------------------------
	SXXXXXXXXXXXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	1<---11----><--------20--------><--------------32-------------->
	SXXXXXXXXXXXHHHHHHHHHHHHHHHHHHHHLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL

	http://www.softelectro.ru/ieee754.html
	
	(1) F = (-1)**s * 2**(X - 2**(b-1) + 1) * (1 + M/2**n); - значение нормализованных чисел
	(2) F = (-1)**s * 2**(X - 2**(b-1) + 2) * M/2**n; - значение денормализованных чисел
	где
	s - флаг минуса,
	b - число бит экспоненты (для Float64 b=11),
	n - число бит мантиссы (для Float64 n=52),
	X - значение смещённой экспоненты (на схеме обозначено X),
	M - значение остатка мантиссы (на схеме обозначено М).
*/

/*	
	Общегражданское выражение числа с двоичным порядком
	F = (-1)**s * 2**E * V;
	где 
	E - значение двоичного порядка,
	V - значение мантиссы.
	из (1) => E = (X - 2**(b-1) + 1), V = (1 + M/2**n);
	из (2) => E = (X - 2**(b-1) + 2), V = (M/2**n);
	Обозначим 
	d - флаг денормализованного числа,
	тогда:
	(3) V = (1 - d + M/2**n) = (1 - d + M/2**52);
	(4) E = (X - 2**(b-1) + 1 + d) = (X - 1023 + d);

 */
 
  /*
   0 <= M <= 2**52-1
   0 <= X <= 2**11 - 1 = 2047
   X = 2047 - признак спецзначений
   X = 0 - признак денормализованных чисел
   1 <= X <= 2046 - для конечных нормализованных чисел
   
   -1022 <= E <= 1023 - для конечных чисел
   E = -1022 - для d
   
   0 <= V <= 1 - 2**(-52) для d
   1 <= V <= 2 - 2**(-52)
   
   dV = 2**(-52);
   dF = 2**(-52+E);
   
   0 <= F <= 2**(-1022) - 2**(-1074) - для денормированных чисел
   2**E <= F <= 2**(1+E) - 2**(-52+E)

   2**(-1022) <= F <= 2**(-1021) - 2**(-1074)
   
   Шаг
   2**(-1074) - для денормированных чисел
   2**(-52+E) - для прочих
   
 */
 
const bigint = require('../bigint/index.js');
 
const DENOMINATOR = 1n<<52n;
const OFFSET = (1n<<10n) - 1n;

const EXP_OFFSET = 52n;
const SIGN_OFFSET = 63n;
const EXP_FLAG = 0x7FFn; //Флаги, длиной как экспонента
const EXP_MASK = EXP_FLAG<<EXP_OFFSET;
const MANT_MASK = DENOMINATOR-1n;

function decompFloat64(number){
	
	let [code] = new BigUint64Array(new Float64Array([number]).buffer);
	let s = code>>SIGN_OFFSET;
	let X = (code & EXP_MASK)>>EXP_OFFSET;
	let M = (code & MANT_MASK);
	
	
	let isXZero = X===0n;
	let isXFlag = X === EXP_FLAG;
	let isMZero = M === 0n;
	
	//Особые состояния
	//1. Нули X=0, M=0
	let isZero = isXZero && isMZero;
	//2. Бесконечности X=F, M = 0
	let isInfinity = isXFlag && isMZero;
	//3. NaN X=F, кроме п.2
	let isNaN = isXFlag && !isMZero; 
	//4. Денормализованные X=0, кроме п.1
	let isSubnormal = isXZero && !isMZero;
	
	let isMinus = s === 1n;
	
	let isSpecial = isXFlag;
	
	let exp = X - OFFSET + BigInt(isSubnormal);
	
	let sizedMant = (isZero || isSubnormal) ? M : M + DENOMINATOR; //V*2**52
	
	return {
		sign:s,
		offsetExp:X,
		modMant: M,
		
		exp,
		sizedMant,
		
		isZero,
		isSpecial,
		isInfinity,
		isNaN,
		isSubnormal,
		isMinus
		
	};
	
}

function packFloat64(modMant, offsetExp, sign){
	const M = BigInt(modMant), X = BigInt(offsetExp), s = BigInt(sign||0);
	
	let code = (s<<SIGN_OFFSET) | (X<<EXP_OFFSET) | M;
	
	let buffer = new BigUint64Array([code]).buffer;
	
	let [value] = new Float64Array(buffer);
	
	return value;
}

function makeFloat64(sizedMant, exp, sign){
	if(sizedMant === 0n){
		return 0;
	}
	
	let imant = bigint.ilog2(sizedMant);
	
	let offset = 52n - imant;
	
	if(offset !== 0n){
		sizedMant = bigint.roundAndShift(sizedMant, offset);
		
		exp = exp - offset;
	}
	
	//Теперь у нас есть нормализованная пара sizedMant,exp
	
	if(exp < -1022n){
		//слишком маленькая степень, надо денормализовать
		offset = exp + 1022n;
		
		sizedMant = bigint.roundAndShift(sizedMant, offset);
		
		//exp = exp + offset;
		//exp = -1022n;
		
		return packFloat64(sizedMant, 0n, sign);
	}
	else if(exp > 1023n){
		//слишком большая степень, число не может быть представлено
		
		return sign ? -Infinity : Infinity;
	}
	else{
		let modMant = sizedMant & MANT_MASK;
		let offsetExp = exp + OFFSET;
		
		return packFloat64(modMant, offsetExp, sign);
	}
}

function isPrec(sizedMant, exp){
	let imant = bigint.ilog2(sizedMant);
	
	let offset = 52n - imant;
	
	exp = exp + offset;
	
	
	if(exp < -1022n){
		//слишком маленькая степень, надо денормализовать
		offset += exp + 1022n;
		
		if(offset>=0){
			return true;
		}
		
		let mask = (1n<<(-offset))-1n;
		
		return (sizedMant & mask) === 0n;
	}
	else if(exp > 1023n){
		//слишком большая степень, число не может быть представлено
		
		return false;
	}
	else{
		return true;
	}

}

module.exports = {
	decompFloat64,
	packFloat64,
	makeFloat64,
	DENOMINATOR,
	MANT_MASK
};