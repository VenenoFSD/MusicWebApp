import axios from 'axios'

const host = 'http://localhost:3000'

export default function (url) {
    return axios.get(host + url);
}