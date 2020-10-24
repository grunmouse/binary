//let c = 1024n**3n -1n; //Предельный размер BigInt
//Array.from({length:16}, ()=>(1n<<c)); //Предел разрешённой памяти

const round = require('./round.js');

function roundAndShift(M, offset){
	M = round(M, -offset);
	return M << offset;
}



module.exports = {
	...require('./convert.js'),
	...require('./ilog2.js'),
	round,
	roundAndShift
};