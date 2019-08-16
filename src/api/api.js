import axios from 'axios';

// let host = 'http://47.103.23.17:8000';
let host = 'http://127.0.0.1:8000';

//登录
export const login = params => {
    return axios.post(`${host}/login/`, params)
}

//获取客户信息

export const getCustomerInfo = params => {
    return axios.get(`${host}/customers/`, { params: params })
}
export const getCustomerDetail= customerid => {
    return axios.get(`${host}/customers/${customerid}/`)
}

export const addCustomerInfo = params => {
    return axios.post(`${host}/customers/`, params)
}

export const updateCustomerInfo = (customerid, params) => {
    return axios.put(`${host}/customers/${customerid}/`, params)
}

export const deleteCustomerInfo = customerid => {
    return axios.delete(`${host}/customers/${customerid}/`)
}

//获取联系人信息

export const getCustomerUserDetail = (customerid, userid) => {
    return axios.get(`${host}/customers_user/`, { params: { customer: customerid, id: userid} })
}
export const addCustomerUser = params => {
    return axios.post(`${host}/customers_user/`, params)
}

export const updateCustomerUser = (customeruserid, params) => {
    return axios.put(`${host}/customers_user/${customeruserid}/`, params)
}

export const deleteCustomerUser = customeruserid => {
    return axios.delete(`${host}/customers_user/${customeruserid}/`)
}

//获取合同信息
export const getContractInfo = (params) => {
    return axios.get(`${host}/contracts/`, { params: params })
}
export const addContractInfo = params => {
    return axios.post(`${host}/contracts/`, params)
}
export const updateContractInfo = (Contractid, params) => {
    return axios.put(`${host}/contracts/${Contractid}/`, params)
}
export const deleteContractInfo = Contractid => {
    return axios.delete(`${host}/contracts/${Contractid}/`)
}
