const assert = require('assert');
const jsc = require('jsverify');

const {
	decompFloat64,
	packFloat64,
	makeFloat64,
	getIndex,
	fromIndex
} = require('../decomp-number.js');


describe('decomp', ()=>{
	it('decomp NaN', ()=>{
		const data = decompFloat64(NaN);
		
		assert.ok(data.isNaN);
		assert.ok(data.isSpecial);
	});	
	
	it('decomp 0', ()=>{
		const data = decompFloat64(0);
		
		assert.ok(data.isZero);
		assert.ok(data.offsetExp == 0n);
		assert.ok(data.modMant == 0n, 'modMant');
		assert.ok(data.sizedMant == 0n, 'sizedMant');
	});
	jsc.property('decomp & pack', 'number', 'nat', (val, m)=>{
		m = m || 1;
		
		val *= m;
		const {
			modMant,
			offsetExp,
			sign,
			sizedMant,
			exp
		} = decompFloat64(val);
		
		assert.equal(packFloat64(modMant, offsetExp, sign), val, 'pack');
		
		return true;
	});	
	
	it('make 0', ()=>{
		assert.equal(makeFloat64(0n, 0n, 0n), 0);
	});
	
	it('make 1/2', ()=>{
		const {
			modMant,
			offsetExp,
			sign,
			sizedMant,
			sizedExp,
			exp
		} = decompFloat64(0.5);
		
		assert.equal(makeFloat64(sizedMant, exp, sign), 0.5);
		let nom = [1n,-1n][sign]*sizedMant;
		let denom = 2n**(-sizedExp);
		assert.equal(Number(nom)/Number(denom), 0.5);
	});
	
	jsc.property('decomp & make', 'number', 'nat', (val, m)=>{
		
		m = m || 1;
		
		val *= m;
		const {
			modMant,
			offsetExp,
			sign,
			sizedMant,
			exp
		} = decompFloat64(val);
		
		assert.equal(makeFloat64(sizedMant, exp, sign), val, 'make');
		
		return true;
	});
	
	jsc.property('getIndex <=> fromIndex', 'number', 'nat', (val, m)=>{
		m = m || 1;
		
		val *= m;
		
		let index = getIndex(val);
		
		const decomp = decompFloat64(val);
		
		assert.equal(decomp.index, index, 'index');
		
		assert.equal(fromIndex(index), val, 'fromIndex');
		
		return true;
	});	
	
});
