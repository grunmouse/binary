# @grunmouse/binary

Модуль для побитовой работы с числами
```
const {
	bigint,
	float64,
	flags,
	zOrder
} = require('@grunmouse/binary');
```

Экспортирует четыре объекта
- [bigint ](#bigint )
- [float64](#float64)
- [flags  ](#flags  )
- [zOrder ](#zorder )



## bigint

Библиотека для работы с длинными целыми

### bigint.fromBuffer(buffer)
Распаковывает неотрицательное длинное целое из буфера, начиная с младших разрядов (Little endian)

@param buffer : ArrayBuffer\
@return BigInt

### bigint.toBuffer(value)
Упаковывает неотрицательное длинное целое буфер, начиная с младших разрядов (Little endian)

@param value : BigInt\
@return ArrayBuffer

### bigint.ilog2(value)
Возвращает наибольшее целое x, такое что 2**x <= value

@param value : BigInt\
@return BigInt

### bigint.over2(value)
Возвращает наибольшее целое x, такое что 2**x >= value

@param value : BigInt\
@return BigInt

### bigint.round(M, s)
Округляет длинное целое до заданной точности, по правилам банковского округления
 
@param M : BigInt - исходное число\
@param s : BigInt - количество отбрасываемых двоичных разрядов (масштаб младшего значимого знака)\
@return BigInt

### bigint.roundAndShift(M, offset)

Сдвигает неотрицательно длинное целое влево на заданное число бит. Если задать отрицательное смещение, то усекаемое число будет округлено функцией bigint.round

@param M : BigInt - исходное число\
@param offset : BigInt - величина смещения влево (если задать отрицательную - будет смещение вправо)\
@return BigInt

## float64

Библиотека для работы с бинарными потрохами 64-разрядного ieee-754.

### float64.decomp(value)

Извлекает все данные о числе и представляет их в удобном для эксплуатации виде

@param value : Number
@return Object

```
{
	sign,
	offsetExp,
	modMant,
		
	exp,
	
	sizedMant,
	sizedExp,
		
	index,
		
	isZero,
	isSpecial,
	isInfinity,
	isNaN,
	isSubnormal,
	isMinus
} = float64.decomp(value);
```

@property sign : BigInt - бит знака числа {0n, 1n}

@property offsetExp : BigInt - значение двоичной экспоненты в смещённом коде (как есть из ieee-754)

@property modMant : BigInt - остаток мантиссы, либо денормализованная мантисса (как есть из ieee-754)


@property exp : BigInt - значение двоичной экспоненты


@property sizedMant : BigInt - масштабированная мантисса (смещённая вправо на 52 бита)

@property sizedExp : BigInt - двоичная экспонента, соответствующая масштабированной мантиссе
$$sizedExp = exp - 52;$$
$$ |value| = sizedMant \cdot 2^{sizedExp} ;$$
$$ |value| = sizedMant \cdot 2^{exp - 52}. $$

@property index : BigInt - номер числа в порядке возрастания.

Для конечных чисел index большего числа больше, чем индекс меньшего. index равных чисел - равны.

@property isZero : Boolean - признак нуля

@property isSpecial : Boolean - признак специального значения

isSpecial = isInfinity || isNaN

@property isInfinity : Boolean - признак бесконечности

@property isNaN  : Boolean - признак NaN

@property isSubnormal : Boolean - признак денормализованного значения

@property isMinus : Boolean - признак отрицательного числа или -0 (isMinus = sign===1n)

### float64.getIndex(value)

Возвращает index числа

@param value : Number\
@return BigInt

### float64.pack(modMant, offsetExp, sign){

Создаёт значение из исходных данных

@param modMant : (BigInt|Number) - остаток мантиссы
@param offsetExp : (BigInt|Number) - смещённая экспонента
@param sign : (BigInt|Number|Null) - бит знака (по умолчанию =0n)
@return Number

### float64.make(sizedMant, exp, sign){

Создаёт значение из исходных данных.\
Если число нельзя представить точно - произойдёт округление мантиссы методом bigint.round.\
При выходе exp за пределы представимых значений, будет возвращено ±0 или ±Infinity.

@param sizedMant - масштабированная мантисса
@param exp - значение двоичной экспоненты
@param sign - бит знака

### float64.ilog2(value)
Возвращает наибольшее целое x, такое что 2**x <= value

@param value : Number\
@return Number

### float64.over2(value)
Возвращает наибольшее целое x, такое что 2**x >= value

@param value : Number\
@return Number

### float64.round(x, s)
Округляет длинное целое до заданной двоичной степени, по правилам банковского округления
 
@param x : Number - исходное число\
@param s : Number - масштаб младшего значимого разряда\
@return Number

## flags

Библиотека для работы с числами как с битовыми полями

### flags.lowerZeroCount(value)
Подсчитывает нулевые биты в младших разрядах до первой единицы, возвращает их количество

@param value : BigInt\
@return BigInt

### flags.lowerFlagCount(value)

Подсчитывает единичные биты в младших разрядах до первого нуля, возвращает их количество

@param value : BigInt\
@return BigInt

### flags.flagCount(value)

Подсчитывает все единичные биты в числе, возвращает их количество

@param value : BigInt\
@return BigInt

### flags.flagNumbers(value)
Возвращает массив позиций единичных битов числа

@param value : BigInt\
@return Array\<Number\>

### flags.nextEqFlag(value)
Для числа value возвращает ближайшее большее число с тем же количеством единичных битов

@param value : BigInt\
@return BigInt

### flags.rotate(size, value, step)
Циклически сдвигает влево значение, полагая его длину равным size

@param size : BigInt - длина в битах\
@param value : BigInt - значение\
@param step : BigInt - величина сдвига (отрицательное значение приведёт к сдвигу вправо)

## zOrder
Библиотека для преобразования группы чисел в [z-order](https://ru.wikipedia.org/?curid=6728003&oldid=123870853) и обратно

### zOrder.zOrder(a, b)
z-order от двух измерений

@param a : BigInt\
@param b : BigInt\
@return BigInt

### zOrder.zOrder3(a, b, c)
z-order от трёх измерений

@param a : BigInt\
@param b : BigInt\
@param с : BigInt\
@return BigInt

### zOrder.zOrderN(arr)
z-order от любого числа измерений

@param arr : Array\<BigInt\>\
@return BigInt

### zOrder.zDimens(z)
Координаты по двухмерному z-order

@param z : BigInt\
@return Array[2]\<BigInt\>

### zOrder.zDimens3(z)
Координаты по трёхмерному z-order

@param z : BigInt\
@return Array[3]\<BigInt\>

### zOrder.zDimensN(z, n)
Координаты по n-мерному z-order

@param z : BigInt\
@param n : BigInt\
@return Array[n]\<BigInt\>
