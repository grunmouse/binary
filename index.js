const float64 = require('./ieee-754/index.js');
const bigint = require('./bigint/index.js');

const flags = require('./binary.js');

module.exports = {
	flags,
	bigint,
	float64
}