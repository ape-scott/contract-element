

export function formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
        }
    }
    return fmt
}

function padLeftZero (str) {
    return ('00' + str).substr(str.length)
}

export const formatMoney = num => {
    if(num){
        if(isNaN(num)) {
            alert("金额中含有不能识别的字符");
            return;
        }
        num = typeof num == "string"?parseFloat(num):num//判断是否是字符串如果是字符串转成数字
        num = num.toFixed(2);//保留两位
        num = parseFloat(num);//转成数字
        num = num.toLocaleString();//转成金额显示模式
        if(num.indexOf('.') == -1) {
            num = num + '.00'
        }
        return num;//返回的是字符串23,245.12保留2位小数
    }else{
        return num = 0.00;
    }
}
export const checkAmt = (rule,value,callback) => {
    if(!value) {
        return new Error('金额字段必填信息')
    }else {
        if(!Number.isInteger(value)) {
            callback(new Error('请输入数字值'))
        }else{
            if(value < 0) {
                callback(new Error('金额不能小于0'))
            }else if(value > 20){
                callback(new Error('不能大于20'))
            }else {
                callback()
            }
        }
    }
}

export function parseTime(time) {
    if (time) {
        var date = new Date(time)
        var year = date.getFullYear()
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        // 拼接
        return year + '年' + month + '月' + day + '日 ' + hours + ':' + minutes + ':' + seconds
    } else {
        return ''
    }
}
