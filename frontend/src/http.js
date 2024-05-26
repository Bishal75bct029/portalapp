import axios from 'axios'

const http = axios.create({
    baseURL: 'http://localhost:8000/',
})

http.interceptors.request.use((config) => {
    if (!config.headers.Authorization) {
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
    }

    return config
})

export default http