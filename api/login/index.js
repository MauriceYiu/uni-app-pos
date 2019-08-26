import fly from "./../http"

export const login = (data) => {
    return fly.request('login', {}, {
        method:"POST",
        headers: {
            "Authorization": data
        }
    }).then(res => res)
}