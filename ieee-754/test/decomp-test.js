const assert = require('assert');
const jsc = require('jsverify');

const {
	decompFloat64,
	packFloat64,
	makeFloat64
} = require('../decomp-number.js');


describe('decomp', ()=>{
	it('NaN', ()=>{
		const data = decompFloat64(NaN);
		
		assert.ok(data.isNaN);
		assert.ok(data.isSpecial);
	});
	jsc.property('[0,1)', 'number', (val)=>{
		const {
			modMant,
			offsetExp,
			sign,
			sizedMant,
			exp
		} = decompFloat64(val);
		
		assert.equal(packFloat64(modMant, offsetExp, sign), val, 'pack');
		assert.equal(makeFloat64(sizedMant, exp, sign), val, 'make');
		
		return true;
	});
});
