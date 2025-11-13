import { Alert } from 'react-native'
import { HOST } from '../utils/config'
import { ensureSession, handleSessionExpired } from './handleSession'

async function apiFetch(endpoint, options = {}, router){
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
            case 400: Alert.alert("Bad request");                   break;
            case 401: handleSessionExpired(router);                 break;
            case 422: handleSessionExpired(router);                 break;
            case 500: Alert.alert("Internal Server Error");         break;
            //case 404: Alert.alert(errMsg + ": Valor inválido");                break;
            //case 409: Alert.alert(errMsg + ": Valor repetido");                break;
        }
    }

    return response
}


export const Api = {
    async login(name, router) {
        return apiFetch(`/login`, {
            method: 'POST',
            body: JSON.stringify({'username': name})
        }, router)
    },

    async authenticate(name, password, router) {
        return apiFetch(`/authenticate`, {
            method: 'POST',
            body: JSON.stringify({'username': name, 'password': password})
        }, router)
    },

    async createUser(name, router) {
        return apiFetch('/createUser', {
            method: 'POST',
            body: JSON.stringify({'username': name}),
        }, router)
    },

    async createPassword(name, password, router) {
        return apiFetch(`/createPassword`, {
            method: 'POST',
            body: JSON.stringify({'username': name, 'password': password})
        }, router)
    },

    async resetPassword(name, router) {
        return apiFetch('/resetPassword', {
            method: 'POST',
            body: JSON.stringify({'username': name}),
        }, router)
    },

    async getUser(name, router) {
        return apiFetch(`/users?name=${name}`, { method: 'GET' }, router)
    },

    async getUsers(router) {
        return apiFetch('/users', { method: 'GET' }, router)
    },

    async getArea(name, router) {
        return apiFetch(`/areas?name=${name}`, { method: 'GET' }, router)
    },

    async getAreas(router) {
        return apiFetch('/areas', { method: 'GET' }, router)
    },

    async getTask(id, router) {
        return apiFetch(`/task?id=${id}`, { method: 'GET' }, router)
    },

    async getTaskList(pending, offset = 0, router){
        return apiFetch(`/taskList?pending=${pending}&offset=${offset}`, { method: 'GET' })
    },

    async updateTask(data, router) {
        return apiFetch('/task', {
            method: 'PATCH',
            body: JSON.stringify(data)
        }, router)
    },

    async createTask(data, router) {
        return apiFetch('/task', {
            method: 'POST',
            body: JSON.stringify(data)
        }, router)
    },

    async getComments(id, router){
        return apiFetch(`/comments?id=${id}`, { method: 'GET' }, router)
    },

    async createComment(comment, router){
        return apiFetch('/comments', {
            method: 'POST',
            body: JSON.stringify(comment)
        }, router)
    },
}

