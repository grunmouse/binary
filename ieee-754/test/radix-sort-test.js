
const assert = require('assert');
const jsc = require('jsverify');

const {
	decompFloat64,
	packFloat64,
	makeFloat64,
	getIndex,
	fromIndex
} = require('../decomp-number.js');

const DENOMINATOR = 1n<<52n;
const OFFSET = (1n<<10n) - 1n;

const EXP_OFFSET = 52n;
const SIGN_OFFSET = 63n;
const EXP_FLAG = 0x7FFn; //Флаги, длиной как экспонента
const EXP_MASK = EXP_FLAG<<EXP_OFFSET;
const MANT_MASK = DENOMINATOR-1n;

const high32_limit = Number((EXP_FLAG<<(EXP_OFFSET - 32n)) - 1n);

describe('sort ieee-754', ()=>{
	
	jsc.property('byIndex', 'number', 'int32', 'number', 'int32', (a, m, b, n)=>{
		m = m || 1;
		n = n || 1;
		
		a *= m;
		b *= n;
		
		let p = decompFloat64(a);
		let q = decompFloat64(b);
		
		if(p.isSpecial || q.isSpecial){
			return true;
		}
		
		assert.equal(a<b, p.index<q.index);
		assert.equal(a>b, p.index>q.index);
		
		return true;
	});	
});