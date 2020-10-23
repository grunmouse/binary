/**
 * Сужает вилку a,b при условии b-a>=1 && fun(a) && !fun(b)
 * @param Function<BigInt, Boolean> fun
 * @param BigInt a - нижняя граница вилки, такая, что fun(a)==true
 * @param BigInt b - верхняя граница вилки, такая, что b>a && fun(b)==false
 * @return [a, b] - предельно узкая вилка
 */
function vilka(fun, a, b){
	let m;
	while((b-a)>1n){
		m = (a+b)>>1n;
		if(fun(m)){
			a = m;
		}
		else{
			b = m;
		}
	}
	return [a, b];
}


/**
 * Находит верхний предел области поиска, возвращает первую вилку
 * @param Function<BigInt, Boolean> fun
 * @param BigInt a - начальное значение нижнего предела
 * @param Function<BigInt, BigInt> next - функция увеличения значения
 * @return {a, b} - начальная вилка
 */
function top(fun, a, next){
	let m, b;
	while(!b){
		m = next(a);
		if(fun(m)){
			a = m;
		}
		else{
			b = m;
		}
	}
	return [a, b];
}

function find(fun, a, next){
	let b;
	[a, b] = top(fun, a, next);
	[a, b] = vilka(fun, a, b);
	
	return [a, b];
}

module.exports = {
	vilka,
	top,
	find
}