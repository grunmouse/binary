const assert = require('assert');
const jsc = require('jsverify');

const {over2, ilog2} = require('../index.js');


describe('bigint', ()=>{

	describe('over2', ()=>{
		it('0', ()=>{
			assert.ok(over2(0n) === 0n);
		});
		it('2', ()=>{
			assert.ok(over2(2n) === 1n);
		});
		jsc.property('bigint32', 'integer 2 32', 'uint32', (x, y)=>{
			let val = 1n<<BigInt(x), mask = val-1n;
			let m = (BigInt(y) & mask);
			val = val | m;
			return m ? over2(val) === BigInt(x+1) : over2(val) === BigInt(x);
		});
		jsc.property('bigint', 'integer 0 1048576', (x)=>{
			let val = 1n<<BigInt(x);
			return over2(val) === BigInt(x);
		});
	});
	describe('ilog2', ()=>{
		it('0', ()=>{
			assert.throws(()=>(ilog2(0n)), RangeError);
		});
		it('1', ()=>{
			assert.equal(ilog2(1n), 0n);
		});
		jsc.property('bigint32', 'integer 2 32', 'uint32', (x, y)=>{
			let val = 1n<<BigInt(x), mask = val-1n;
			let m = (BigInt(y) & mask);
			val = val | m;
			return ilog2(val) === BigInt(x);
		});
	});
});