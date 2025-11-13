import {
    Alert,
    Text,
    View,
    Button
} from 'react-native';

import { ScreenWrapper } from '../../../components/ScreenWrapper'
import { CustomButton }  from '../../../components/CustomButton'

import { useRouter } from 'expo-router'
import { useState }  from 'react'

import { Api }    from '../../../services/api'
import { logout } from '../../../services/handleSession'

export default function Settings() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const newUser = async (name) => {
        if(name == "") {
            Alert.alert("É necessario informar um nome de usuário")
            return
        }

        let response = await Api.createUser(name, router)
        if(!response.ok){
            if(response.status == 409) Alert.alert("Usuário já existe")
            return
        }

        Alert.alert("Usuário criado com sucesso")
    }

    const resetPassword = async (name) => {
        if(name == "") {
            Alert.alert("É necessario informar um nome de usuário")
            return
        }

        let response = await Api.resetPassword(name, router)
        if(!response.ok){
            if(response.status == 404) Alert.alert("Usuário não encontrado")
            return
        }

        Alert.alert(`Senha do usuário ${name} resetado com sucesso.`)
    }

    const newUserPrompt = () => {
        setLoading(true)
        Alert.prompt(
            "Novo usuário",
            "Insira o nome do novo Usuário",
            [
                {text: "Criar", onPress: async (name) => {await newUser(name)}},
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
                {text: "Resetar", onPress: async (name) => {await resetPassword(name)}},
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
