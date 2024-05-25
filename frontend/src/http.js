import axios from 'axios'

const http = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
    },
})

export default http