const {
	lowerZeroCount,
	lowerFlagCount,
	flagCount,
	flagNumbers,
	nextEqFlag,
	
	rotate,
	allRot,
	
	uniqueShift
} = require('./flags.js');

/**
 * @param a : BigInt
 * @param b : BigInt
 * @return BigInt
 */

function zOrder(a, b){
	let result = 0n;
	for(let i of flagNumbers(a)){
		result += (1n<<(i*2n));
	}
	for(let i of flagNumbers(b)){
		result += (1n<<(i*2n+1n));
	}
	return result;
}

function zOrder3(a, b, c){
	let result = 0n;
	for(let i of flagNumbers(a)){
		result += (1n<<(i*3n));
	}
	for(let i of flagNumbers(b)){
		result += (1n<<(i*3n+1n));
	}
	for(let i of flagNumbers(c)){
		result += (1n<<(i*3n+2n));
	}
	return result;
}

function zOrderN(arr){
	let n = BigInt(arr.length);
	for(let j =0n; j<n; ++j){
		for(let i of flagNumbers(arr[j])){
			result += 1n<<BigInt(i*n + j);
		}
	}
	return result;
	
}

function zDimens(z){
	let d = [0n, 0n];
	for(let i of flagNumbers(z)){
		let j = i % 2n;
		let index = i / 2n;
		d[j] += (1n<<index);
	}
	return d;
}
function zDimens3(z){
	let d = [0n, 0n, 0n];
	for(let i of flagNumbers(z)){
		let j = i % 3n;
		let index = i / 3n;
		d[j] += (1n<<index);
	}
	return d;
}
function zDimensN(z, n){
	n = BigInt(b);
	let d = Array.from({length:n}, ()=>(0n));
	for(let i of flagNumbers(z)){
		let j = i % n;
		let index = i / n;
		d[j] += (1n<<index);
	}
	return d;
}

module.exports = {
	zOrder,
	zOrder3,
	zOrderN,
	zDimens,
	zDimens3,
	zDimensN
};