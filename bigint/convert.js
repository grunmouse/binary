
function fromBuffer(buffer){
	const len = buffer.byteLength;
	const dv = new DataView(buffer);
	
	let val = 0n;
	for(let offset = (len-1) & (!7); offset >=0; offset-=8){
		val = (val<<64n) | dv.getBigUint64(offset, true);
	}
	
	return val;
}

/**
 * LE
 */
function toBuffer(value, size){
	let arr = [];
	const mask = 0xFFFFFFFFFFFFFFFFn;
	
	for(let i=0; value; ++i){
		arr[i] = value & mask;
		value = value >> 64n;
	}
	
	size = size || arr.length*8;

	const buffer = new ArrayBuffer(size);
	const dv = new DataView(buffer);
	arr.forEach((value, i)=>{
		let offset = i<<3;
		dv.setBigUint64(offset, value, true);
	});
	
	return buffer;
}

module.exports = {
	fromBuffer,
	toBuffer
}