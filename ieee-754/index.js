
const round = require('./round.js')

const {
	decompFloat64
	packFloat64
} = require('./decomp-number.js');

module exports = {
	decomp:decompFloat64,
	pack:packFloat64,
	round
}