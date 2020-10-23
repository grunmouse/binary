
const mask = (size)=>((1n<<BigInt(size))-1n);

const {top, vilka, find} = require('./service.js');

/**
 * Возвращает число x, такое что 2**x >= value
 */
function over2(value){
	if(value < 2n){
		return 0n;
	}

	let [a, b] = find((x)=>(value>>x), 1n, (x)=>(x<<1n));
	
	if(value === 1n<<a){
		return a;
	}
	else{
		return b;
	}
}

function ilog2(value){
	if(value === 0n){
		throw new RangeError(`Logariphm of 0 is not exists`);
	}
	else if(value===1n){
		return 0n;
	}
	let [a, b] = find((x)=>(value>>x), 1n, (x)=>(x<<1n));
	return b-1n;
}

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
 * Для числа value возвращает ближайшее большее число с тем же количеством единичных битов
 * @param {BigInt} value
 * @return {BigInt}
 */
function nextEqFlag(value){
	let lz = lowerZeroCount(value);
	let f = lowerFlagCount(value>>lz)-1n;
	return value + (1n<<lz) + ((1n<<f)-1n);
}


module.exports = {
	over2,
	ilog2,
	lowerZeroCount,
	lowerFlagCount,
	flagCount,
	nextEqFlag
};