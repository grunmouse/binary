const assert = require('assert');
const jsc = require('jsverify');
const {
	lowerZeroCount,
	lowerFlagCount,
	flagCount,
	nextEqFlag
} = require('../flags.js');

describe('flags', ()=>{

	
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