import {
    Alert,
    Text,
    View,
    Button
} from 'react-native';

import { useRouter } from 'expo-router'
import { useState }  from 'react'

import { ScreenWrapper } from '../../../components/ScreenWrapper'
import { CustomButton }  from '../../../components/CustomButton'

import { HOST }   from '../../../utils/config'

import { logout, ensureSession, handleSessionExpired } from '../../../services/handleSession'

export default function Settings() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const newUser = async (text) => {
        const sessionToken = await ensureSession()

        if(text == "") {
            Alert.alert("É necessario informar um nome de usuário")
            return
        }

        let response = await fetch(`${HOST}/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${sessionToken}`,
            },
            body: JSON.stringify({'username': text})
        })

        if(!response.ok){
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 401) handleSessionExpired(router)
            if(response.status == 409) Alert.alert("Usuário já existe")
            if(response.status == 500) Alert.alert("Internal Server Error")
            return
        }

        Alert.alert("Usuário criado com sucesso")
    }

    const resetPassword = async (text) => {
        const sessionToken = await ensureSession()

        if(text == "") {
            Alert.alert("É necessario informar um nome de usuário")
            return
        }

        let response = await fetch(`${HOST}/resetPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${sessionToken}`,
            },
            body: JSON.stringify({'username': text})
        })

        if(!response.ok){
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 401) handleSessionExpired(router)
            if(response.status == 404) Alert.alert("Usuário não encontrado")
            if(response.status == 500) Alert.alert("Internal Server Error")
            return
        }

        Alert.alert(`Senha do usuário ${text} resetado com sucesso.`)
    }

    const newUserPrompt = () => {
        setLoading(true)
        Alert.prompt(
            "Novo usuário",
            "Insira o nome do novo Usuário",
            [
                {text: "Criar", onPress: async (text) => { await newUser(text) }},
                {text: "Cancelar" }
            ]
        )
        setLoading(false)
    }

    const resetPasswordPrompt = () => {
        setLoading(true)
        Alert.prompt(
            "Resetar senha",
            "Insira o nome do Usuário que deseja resetar a senha",
            [
                {text: "Resetar", onPress: async (text) => { await resetPassword(text) }},
                {text: "Cancelar" }
            ]
        )
        setLoading(false)

    }

    return (
        <ScreenWrapper>
            <View>
                <CustomButton style={{marginBottom: 8}} title="Sair" onPress={() => logout(router)} />
                <CustomButton style={{marginBottom: 8}} title="Criar Usuário" onPress={() => newUserPrompt()} />
                <CustomButton style={{marginBottom: 8}} title="Esquecer senha" onPress={() => resetPasswordPrompt()} />
            </View>
        </ScreenWrapper>
    )
}
