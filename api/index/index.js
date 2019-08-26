import fly from "./../http"
// 获取分区
export const getAreaInfo = (storeId) => {
    return fly.request('get-par', {storeId}, {
        method:"GET",
    }).then(res => res)
}
// 获取台桌列表
export const getDesks = (params) => {
    return fly.request('get-allPar', params, {
        method:"GET",
    }).then(res => res)
}
// 获取台桌的详细信息
export const getDeskDetail = (params) => {
    return fly.request('get-numDetail', params, {
        method:"GET",
    }).then(res => res)
}