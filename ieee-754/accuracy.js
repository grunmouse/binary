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
		exp
	} = decompFloat64(value);
	
	let acc = makeFloat64(1, exp);
	
	return acc;
}

module.exports = accuracy;