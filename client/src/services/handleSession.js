import { Alert } from 'react-native'

import { useRouter } from 'expo-router'
import AsyncStorage  from '@react-native-async-storage/async-storage'

// Warning session's functions does not handle rare errors related to full or currupted storage
export async function createSession(access_token){
    await AsyncStorage.setItem('@jwt-access_token', access_token)
}

export async function getSession(){
    const access_token = await AsyncStorage.getItem('@jwt-access_token')
    return access_token
}

async function clearSessionToken(){
    await AsyncStorage.removeItem('@jwt-access_token')
}

export async function login(router, sessionToken){
    await createSession(sessionToken)
    router.replace("/(tabs)/tasks")
}

export async function logout(router){
    await clearSessionToken()
    router.replace("/(auth)/login")
}

export async function isValidSession(sessionToken){
    if(!sessionToken) return false
    return true
}

export async function handleSessionExpired(router){
    Alert.alert(
        "Sessão expirada",
        "Sua sessão expirou, faça login novamente"
    )
    logout(router)
}

export async function ensureSession(router){
    const sessionToken = await getSession()

    if (!isValidSession(sessionToken)){
        await handleSessionExpired(router)
        return null
    }

    return sessionToken
}
