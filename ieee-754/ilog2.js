const {
	decompFloat64,
	packFloat64
} = require('./decomp-number.js');

const bigint = require('../bigint/index.js');

function ilog2(x){
	const {exp,	sizedMant, isSubnormal, isZero, isSpecial} = decompFloat64(x);
	if(isZero || isSpecial){
		//throw new RangeError(`Logariphm of ${x} is not exists`);
		return NaN;
	}
	else if(isSubnormal){
		let ilog2M = bigint.ilog2(sizedMant);
		return Number(exp + ilog2M - 52n);
	}
	else{
		return Number(exp);
	}
}

function over2(x){
	let ilog = ilog2(x);
	let y = 1<<ilog;
	if(x>y){
		ilog++;
	}
	return ilog;
}

module.exports = {
	ilog2,
	over2
};