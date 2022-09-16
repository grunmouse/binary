
/**
 * Округляет длинное целое до заданной точности
 *
 * @param BigInt M - исходное число
 * @param BigInt s - количество отбрасываемых символов (масштаб младшего значимого знака)
 */
function round(M, s){
	s = BigInt(s);
	M = BigInt(M);
	if(s<=0n){
		return M;
	}
	
	if(M<0n){
		return -round(-M, s);
	}
	
	const unit = 1n<<s; //Первый знак выше округления
	const maskS = unit - 1n; //Вся отбрасываемая часть
	const half = unit >> 1n; //Первый знак ниже округления
	const maskL = half - 1n; //Второй и последующие знаки после округления
	
	let val = M ^ (M & maskS); //Отбросили дробную часть
	
	//val <= M <= val+unit

	if((M & half) === half){
		//Дробь - не меньше половины
		if((M & maskL) === 0n){
			//Дробь строго равна половине - делаем округление до чётного
			if((M & unit) === unit){
				val += unit;
			}
		}
		else{
			//Дробь больше половины - округляем вверх
			val += unit;
		}
	}
	return val;
}

module.exports = round;