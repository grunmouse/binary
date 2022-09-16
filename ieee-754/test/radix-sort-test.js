
const assert = require('assert');
const jsc = require('jsverify');

const {
	decompFloat64,
	packFloat64,
	makeFloat64
} = require('../decomp-number.js');

const DENOMINATOR = 1n<<52n;
const OFFSET = (1n<<10n) - 1n;

const EXP_OFFSET = 52n;
const SIGN_OFFSET = 63n;
const EXP_FLAG = 0x7FFn; //Флаги, длиной как экспонента
const EXP_MASK = EXP_FLAG<<EXP_OFFSET;
const MANT_MASK = DENOMINATOR-1n;

const high32_limit = Number((EXP_FLAG<<(EXP_OFFSET - 32n)) - 1n);

describe('radix sort ieee-754', ()=>{
	jsc.property('posit', jsc.integer(0, high32_limit), 'uint32', jsc.integer(0, high32_limit), 'uint32', (a, b, c, d)=>{
		let p = BigInt(a)<<32n | BigInt(b);
		let q = BigInt(c)<<32n | BigInt(d);
		let mp = p & MANT_MASK;
		let mq = q & MANT_MASK;
		let ep = ((p & EXP_MASK)>>EXP_OFFSET);
		let eq = ((q & EXP_MASK)>>EXP_OFFSET);
		
		let x = packFloat64(mp, ep);
		let y = packFloat64(mq, eq);
		
		return (x<y) === (p<q);
	});	
	jsc.property('negat', jsc.integer(0, high32_limit), 'uint32', jsc.integer(0, high32_limit), 'uint32', (a, b, c, d)=>{
		let p = BigInt(a)<<32n | BigInt(b) | (1n<<SIGN_OFFSET);
		let q = BigInt(c)<<32n | BigInt(d) | (1n<<SIGN_OFFSET);
		let mp = p & MANT_MASK;
		let mq = q & MANT_MASK;
		let ep = ((p & EXP_MASK)>>EXP_OFFSET);
		let eq = ((q & EXP_MASK)>>EXP_OFFSET);
		
		let x = packFloat64(mp, ep, 1n);
		let y = packFloat64(mq, eq, 1n);

		return (x<y) === (p>q);
	});
});