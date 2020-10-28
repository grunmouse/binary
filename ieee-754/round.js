const {
	decompFloat64,
	packFloat64,
	DENOMINATOR,
	MANT_MASK
} = require('./decomp-number.js');

const bigint = require('../bigint/index.js');

/**
 * Округляет до двоичной степени s
 */
function round(x, s){
	let {exp, sizedMant, modMant, offsetExp, isSpecial, isSubnormal, sign} = decompFloat64(x);
	exp = Number(exp);
	if(isSpecial){
		return x;
	}
	if(s > exp){
		//Число меньше порядка округления
		return 0;
	}
	if(s <= exp-52){
		//Порядок округления меньше точности числа
		return x;
	}
	
	if(isSubnormal){
		let m = bigint.round(modMant, exp-s);
		if(m>=DENOMINATOR){
			//Появилась единица
			m = m & MANT_MASK;
			return packFloat64(m, 1n, sign);
		}
		else{
			//Число осталось денормализованным
			return packFloat64(m, 0n, sign);
		}
	}
	else{
		let m = bigint.round(modMant, exp-s);
		if(m>=DENOMINATOR*2){
			//Целая часть больше 1
			m = m >> 1n;
			return packFloat64(m & MANT_MASK, offsetExp+1n, sign);
		}
		else{
			//Число осталось в старых пределах
			return packFloat64(m & MANT_MASK, offsetExp, sign);
		}
	}
}

module.exports = round;