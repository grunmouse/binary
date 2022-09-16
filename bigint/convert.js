/**
 * LE
 */
function fromBuffer(buffer){
	const len = buffer.byteLength;
	const dv = new DataView(buffer);
	
	let val = 0n;
	for(let offset = (len-1); offset >=0; --offset){
		val = (val<<8n) | BigInt(dv.getUint8(offset));
	}
	
	return val;
}

/**
 * LE
 */
function toBuffer(value, size){
	let arr = [];
	const mask = 0xFFn;
	
	for(let i=0; value; ++i){
		arr[i] = value & mask;
		value = value >> 8n;
	}
	
	size = size || arr.length;

	const buffer = new ArrayBuffer(size);
	const dv = new DataView(buffer);
	arr.forEach((value, i)=>{
		dv.setUint8(i, Number(value));
	});
	
	return buffer;
}

module.exports = {
	fromBuffer,
	toBuffer
}