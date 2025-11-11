import { Alert } from 'react-native'
import { HOST } from '../utils/config'
import { ensureSession, handleSessionExpired } from './handleSession'

async function apiFetch(endpoint, options = {}, router, errMsg){
    const token = await ensureSession()

    const response = await fetch(`${HOST}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {}),
        },
    })

    if (!response.ok) {
        switch(response.status){
            case 400: Alert.alert(errMsg + ": Bad request");                   break;
            case 401: handleSessionExpired(router);                         break;
            case 404: Alert.alert(errMsg + ": Valor inválido");                break;
            case 409: Alert.alert(errMsg + ": Valor repetido");                break;
            case 422: handleSessionExpired(router);                         break;
            case 500: Alert.alert(errMsg + ": Internal Server Error");         break;
            default:  Alert.alert(errMsg + `: HTTP Code: ${response.status}`); break;
        }
    }

    return response
}


export const Api = {
  async getUser(name, router) {
    return apiFetch(`/users?name=${name}`, { method: 'GET' }, router, `Erro ao buscar o usuário ${name}`)
  },

  async getUsers(router) {
    return apiFetch('/users', { method: 'GET' }, router, "Erro ao buscar usuários")
  },

  async createUser(data, router) {
    return apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }, router, "Erro ao criar usuário")
  },

  async getArea(name, router) {
    return apiFetch(`/areas?name=${name}`, { method: 'GET' }, router, `Erro ao buscar a area ${name}`)
  },

  async getAreas(router) {
    return apiFetch('/areas', { method: 'GET' }, router, "Erro ao buscar areas")
  },

  async createTask(data, router) {
    return apiFetch('/createTask', {
      method: 'POST',
      body: JSON.stringify(data),
    }, router, "Erro ao criar Tarefa")
  },
}

