
const mask = (size)=>((1n<<BigInt(size))-1n);

const {top, vilka, find} = require('./service.js');


/**
 * Подсчитывает нулевые биты в младших разрядах до первой единицы, возвращает их количество
 * @param {BigInt} value
 * @return {BigInt}
 */
function lowerZeroCount(value){
	if((value & 1n) === 1n){
		return 0n;
	}
	if((value & 0xFFn) != 0n){
		let part = value & 0xFFn;
		let i=0n;
		while((part & 1n) === 0n){
			++i;
			part = part >> 1n;
		}
		return i;
	}
	
	let [a, b] = find((x)=>((value & mask(x)) === 0n), 1n, (x)=>(x<<1n));
	return a;
}

/**
 * Подсчитывает единичные биты в младших разрядах до первого нуля, возвращает их количество
 * @param {BigInt} value
 * @return {BigInt}
 */
function lowerFlagCount(value){
	if((value & 1n) === 0n){
		return 0n;
	}
	if((value & 0xFFn) != 0xFFn){
		let part = value & 0xFFn;
		let i=0n;
		while((part & 1n) === 1n){
			++i;
			part = part >> 1n;
		}
		return i;
	}
	
	let [a, b] = find((x)=>{
		let m = mask(x);
		return (value & m) === m;
	}, 1n, (x)=>(x<<1n));
	
	return a;
}


/**
 * Все единичные биты в числе, возвращает их количество
 * @param {BigInt} value 
 * @return {BigInt}
 */
function flagCount(value){
	let r =0n;
	while(value){
		if(value & 1n){
			++r;
		}
		value = value>>1n;
	}
	return r;
}

/**
 * Возвращает массив позиций единичных битов числа
 */
function flagNumbers(value){
	let r = [], i=0n;
	while(value){
		if(value & 1n){
			r.push(i);
		}
		value = value>>1n;
		++i;
	}
	return r;
}

/**
 * Для числа value возвращает ближайшее большее число с тем же количеством единичных битов
 * @param {BigInt} value
 * @return {BigInt}
 */
function nextEqFlag(value){
	let lz = lowerZeroCount(value);
	let f = lowerFlagCount(value>>lz)-1n;
	return value + (1n<<lz) + ((1n<<f)-1n);
}

/**
 * Фильтрует из массива значения, не являющиеся сдвигом друг друга
 * @param values : Array<BigInt>
 */
function uniqueShift(values){
	values = values.slice(0);
	
	values.sort((a,b)=>(Number(a-b)));
	const max = values[values.length-1];
	const result = [], set = new Set();
	
	for(let val of values){
		if(!set.has(val)){
			result.push(val);
			if(val == 0n){
				set.add(val);
			}
			else{
				for(; val <= max; val <<= 1n){
					set.add(val);
				}
			}
		}
	}
	
	return result;
}

module.exports = {
	lowerZeroCount,
	lowerFlagCount,
	flagCount,
	flagNumbers,
	nextEqFlag,
	
	uniqueShift
};