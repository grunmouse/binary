const assert = require('assert');
const jsc = require('jsverify');
const {
	over2,
	ilog2,
	lowerZeroCount,
	lowerFlagCount,
	flagCount,
	nextEqFlag
} = require('../index.js');

describe('@grunmouse/binary', ()=>{
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
	
	describe('lowerZeroCount', ()=>{
		jsc.property('test', 'uint32', 'uint8', (x, y)=>{
			let val = (BigInt(x) | 1n) << BigInt(y);

			return lowerZeroCount(val) === BigInt(y);
		});
	});	
	
	describe('lowerFlagCount', ()=>{
		jsc.property('test', 'uint32', 'uint8', (x, y)=>{
			let val = ((BigInt(x) | 1n) << BigInt(y)) - 1n;

			return lowerFlagCount(val) === BigInt(y);
		});
	});
	
	describe('flagCount nextEqFlag', ()=>{
		jsc.property('flagCount', 'uint8', (x)=>{
			x = BigInt(x);

			return flagCount(1n<<x) === 1n;
		});		
		jsc.property('test', 'uint32', (x)=>{
			x = BigInt(x);
			let c = flagCount(x);
			let y = nextEqFlag(x);

			return flagCount(y) === flagCount(x);
		});
	});
});