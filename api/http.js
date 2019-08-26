let Fly = require("flyio/dist/npm/wx")
let fly = new Fly

//设置超时
fly.config.timeout = 30000;
//设置请求基地址
fly.config.baseURL = 'https://staging-table-api.huoxingy.com/v1/pos'

// 添加请求拦截器
fly.interceptors.request.use((request) => {
    // 在发送请求之前做些什么
    const token = uni.getStorageSync('token');
    if (!token) {
        uni.redirectTo({
            url: './../pages/login/login'
        });
    }else{
        request.headers.Authorization = JSON.parse(token);
    }
    return request
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
})

// 添加响应拦截器
fly.interceptors.response.use((res) => {
    // 对响应数据做些事
    // if (!res.data) {
    // return Promise.reject(res)
    // }
    return res
}, (error) => {
    if (error.response) {
        let tipText;
        error.response.data.message?tipText=error.response.data.message:tipText=error.response.data;
        if ( error.response.status == 401 ) {
            tipText = '帐号失效';
        } else if ( error.response.status == 403 ) {
            tipText = '权限不足';
        }
        if ( tipText ) {
            uni.showToast({
                title: tipText,
                duration: 2000,
                icon:"none"
            });
        }
    }
    return Promise.reject(error);
})
export default fly;