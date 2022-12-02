const {top, vilka, find} = require('../service.js');
/**
 * Возвращает наименьшее целое x, такое что 2**x >= value
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

/**
 * Возвращает наибольшее целое x, такое что 2**x <= value
 */
function ilog2(value){
	if(value <= 0n){
		throw new RangeError(`Logariphm of ${value} is not exists`);
	}
	else if(value===1n){
		return 0n;
	}
	let [a, b] = find((x)=>(value>>x), 1n, (x)=>(x<<1n));
	return b-1n;
}


module.exports = {
	over2,
	ilog2
}