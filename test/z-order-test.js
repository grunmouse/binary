const assert = require('assert');
const jsc = require('jsverify');
const {
	zOrder,
	zOrder3,
	zOrderN,
	zDimens,
	zDimens3,
	zDimensN
} = require('../z-order.js');

describe('z-order', ()=>{

	describe('zOrder', ()=>{
		[
			[0n, 0n, 0n],
			[1n, 0n, 1n],
			[0n, 1n, 2n],
			[1n, 1n, 3n],
			[3n, 0n, 5n],
			[0n, 3n, 10n],
		].forEach(([a, b, r])=>{
			it(r.toString(), ()=>{
				let ret = zOrder(a, b);
				assert.equal(ret, r);
			});
		});
	});
	
	jsc.property('zOrder<=>zDimens', 'nat', 'nat', (a, b)=>{
		a = BigInt(a); b = BigInt(b);
		let z = zOrder(a, b);
		let d = zDimens(z);
		return a === d[0] && b === d[1];
	});

	jsc.property('zOrder3<=>zDimens3', 'nat', 'nat', 'nat', (a, b, c)=>{
		a = BigInt(a); b = BigInt(b); c = BigInt(c);
		let z = zOrder3(a, b, c);
		let d = zDimens3(z);
		return a === d[0] && b === d[1] && c === d[2];
	});
});