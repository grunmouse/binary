const bigMath = {
  abs:function(x) {
    return x < 0n ? -x : x
  },
  sign:function(x) {
    if (x === 0n) return 0n
    return x < 0n ? -1n : 1n
  },
  pow:function(base, exponent) {
    return base ** exponent
  },
  min:function(value, ...values) {
    for (const v of values)
      if (v < value) value = v
    return value
  },
  max:function(value, ...values) {
    for (const v of values)
      if (v > value) value = v
    return value
  }
}

module.exports = bigMath;