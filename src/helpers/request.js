import axios from 'axios'

axios.defaults.baseURL = "https://note-server.hunger-valley.com";
axios.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded;charset:utf-8;";
axios.defaults.headers.patch['Content-Type'] = "application/x-www-form-urlencoded;charset:utf-8;";
axios.defaults.withCredentials = true;

export default function request({ url, method = "GET", data = {} }) {
    return new Promise((resolve, reject) => {
        let option = { url, method };
        if (method.toLowerCase() === "get") {
            option.params = data;
        } else { option.data = data; }
        axios(option).then(res => {
            if (res.status === 200) { resolve(res.data); } else { reject(res.data); }
        }).catch(err => { reject(err); })
    })
}