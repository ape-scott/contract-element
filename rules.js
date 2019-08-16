

// 类似金钱,首位不为0,最多2位小数
export function checkAmt(rule, value, callback) {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (!value) {
    return callback(new Error('请填写金额'))
  } else if (!reg.test(value)) {
    return callback(new Error('金额,最多2位小数'))
  } else {
    callback()
  }
}
