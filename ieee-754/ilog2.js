const {
	decompFloat64,
	packFloat64
} = require('./decomp-number.js');

const bigint = require('../bigint/index.js');

function ilog2(x){
	const {exp,	sizedMant, isSubnormal, isZero, isSpecial} = decompFloat64(x);
	if(isZero || isSpecial){
		throw new RangeError(`Logariphm of ${x} is not exists`);
	}
	else if(isSubnormal){
		let ilog2M = bigint.ilog2(sizedMant);
		return exp + ilog2M - 52n;
	}
	else{
		return exp;
	}
}

module.exports = ilog2;