const {
	decompFloat64,
	makeFloat64
} = require('./decomp-number.js');

/**
 * @function accuracy
 * Точность представления данного числа
 *
 */
function accuracy(value){
	let {
		exp,
		offsetExp
	} = decompFloat64(value);
	let acc = makeFloat64(1n, exp);
	
	return acc;
}

module.exports = accuracy;