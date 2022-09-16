const assert = require('assert');
const jsc = require('jsverify');

const {
	over2, ilog2,
	toBuffer, fromBuffer,
	round
} = require('../index.js');

const BigMath = require('../big-math.js');

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
	
	describe('convert', ()=>{
		it('exist toBuffer', ()=>{
			assert.ok(toBuffer);
		});
		it('exist fromBuffer', ()=>{
			assert.ok(fromBuffer);
		});
		jsc.property('bigint32 <=>', 'uint32', (x)=>{
			x = BigInt(x);
			let buffer = toBuffer(x);
			assert(buffer instanceof ArrayBuffer);
			let y = fromBuffer(buffer);
			
			return x === y;
		});
		jsc.property('bigint64 <=>', 'uint32', 'uint32', (a, b)=>{
			let x = BigInt(a)<<32n | BigInt(b);
			let buffer = toBuffer(x);
			assert(buffer instanceof ArrayBuffer);
			let y = fromBuffer(buffer);
			
			return x === y;
		});
	});
	
	describe('round', ()=>{
		jsc.property('round bigint64', 'uint32', 'uint32', jsc.integer(1, 63), (a, b, s)=>{
			let x = BigInt(a)<<32n | BigInt(b);
			s = BigInt(s);
			let y = round(x, s);
			const unit = 1n<<s; //Первый знак выше округления
			const mask = unit-1n;
			
			assert.equal(y & mask, 0n);
			
			if(x === y){
				return true;
			}
			
			let z;
			if(x > y){
				z = y + unit;
			}
			else if(y > x){
				z = y - unit;
			}
			
			let cond = BigMath.abs(x-y) <= BigMath.abs(x-z);
			
			assert.ok(cond);
			
			if(BigMath.abs(x-y) === BigMath.abs(x-z)){
				assert.equal(x & unit, 0n);
			}
			
			return true;
		});
	});
});