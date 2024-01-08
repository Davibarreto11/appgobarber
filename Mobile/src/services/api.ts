import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.1.12:3333'
})

api.interceptors.response.use((response) => {
  return response
}, (error) => {
  console.log(error)
  return {}
})

export default api
