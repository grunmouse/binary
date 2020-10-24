
function fromBuffer(buffer){
	let arr = new BigUint64Array(buffer);
	
	let val = 0n;
	for(let i = arr.length; i--;){
		val = (val<<64n) | arr[i];
	}
	
	return val;
}

function toBuffer(value, size){
	let arr = [];
	const mask = 0xFFFFFFFFFFFFFFFFn;
	
	for(let i=0; value; ++i){
		arr[i] = value & mask;
		value = value >> 64n;
	}
	
	size = size || arr.length;

	let brr = new BigUint64Array(size);
	brr.set(arr, 0);
	
	return brr.buffer;
}

module.exports = {
	fromBuffer,
	toBuffer
}