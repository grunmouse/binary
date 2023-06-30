
const round = require('./round.js')
const accuracy = require('./accuracy.js')

const {
	decompFloat64,
	packFloat64,
	makeFloat64,
	fromIndex,
	getIndex,
} = require('./decomp-number.js');

module.exports = {
	decomp:decompFloat64,
	pack:packFloat64,
	make:makeFloat64,
	fromIndex,
	getIndex,
	...require('./ilog2.js'),
	round,
	accuracy
}