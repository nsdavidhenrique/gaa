import {
    Text,
    View,
    Button,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';

import { useState, useEffect } from 'react'
import { useRouter }           from 'expo-router';
import { useTheme }            from '../../hooks/useTheme.js'

import { HOST }          from '../../utils/config'
import { commonStyles }  from '../../styles/commonStyles';
import { ScreenWrapper } from '../../components/ScreenWrapper'
import { CustomButton }  from '../../components/CustomButton'

import { login, getSessionToken, isValidSession } from '../../services/handleSession'


export default function Login(){
    const [name,            setName]            = useState("")
    const [password,        setPassword]        = useState("")
    const [newPassword,     setNewPassword]     = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [askedPassword,   setAskedPassword]   = useState(false)
    const [hasPassword,     setHasPassword]     = useState(false)
    const [loading,         setLoading]         = useState(false)

    const router = useRouter()
    const theme  = useTheme()
    const styles = commonStyles(theme)

    useEffect(() => {
        if(!askedPassword) return
        setPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setAskedPassword(false)
        setHasPassword(false)
    }, [name])

    // TODO this is broken
    useEffect(() => {
        //const loginIfSessionIsOpened = async () => {
        //    let session = await getSessionToken()
        //    if(session) await login(router, session)
        //}
        //loginIfSessionIsOpened()
    }, [router])

    const submit = async () => {
        if(name == "") {
            Alert.alert("Insira o usuário")
            return
        }

        let response = await fetch(`${HOST}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': name})
        })

        if(!response.ok){
            if(response.status == 404) Alert.alert("Usuário inválido")
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 500) Alert.alert("Internal Server Error")
            return
        }

        let body = await response.json()
        if(body.data.hasPassword) setHasPassword(true)
        else                      setHasPassword(false)

        setAskedPassword(true)
    }

    const authenticate = async () => {
        if(name == "" || password == ""){
            Alert.alert("Insira usuário e senha")
            return
        }

        let response = await fetch(`${HOST}/authenticate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': name, 'password': password})
        })

        if(!response.ok){
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 401) Alert.alert("Usuário ou senha inválida")
            if(response.status == 500) Alert.alert("Internal Server Error")
            setPassword("")
            return
        }
        
        let body = await response.json()
        await login(router, body.data);
    }

    const createPassword = async () => {
        if(newPassword == ""){
            Alert.alert("Insira a senha")
            return
        }
        if(confirmPassword == ""){
            Alert.alert("Confirme a senha")
            return
        }
        if(newPassword != confirmPassword){
            Alert.alert("As senhas não coincidem")
            return
        }

        let response = await fetch(`${HOST}/createPassword`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': name, 'password': newPassword})
        })

        if(!response.ok){
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 404) Alert.alert("Usuário inválido")
            if(response.status == 500) Alert.alert("Internal Server Error")
            return
        }

        setPassword(newPassword)
        await authenticate()
    }

    // TODO view centered nao responsível
    return(
        <ScreenWrapper style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={[styles.centered, {
                width: 300,
                height: 300,
                backgroundColor: theme.colors.secondary,
                borderRadius: 40
            }]}>
                <View style={{paddingBottom: 8}}>
                    <TextInput
                        style={[styles.input,{width: 200}]}
                        placeholder="Usuario"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {askedPassword && (
                    <View style={{ paddingBottom: 8 }}>
                        {hasPassword ? (
                            <TextInput
                                style={[styles.input, { width: 200 }]}
                                placeholder="Senha"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        ) : (
                            <>
                                <TextInput
                                    style={[styles.input, { width: 200, marginBottom: 8 }]}
                                    placeholder="Nova Senha"
                                    secureTextEntry
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TextInput
                                    style={[styles.input, { width: 200 }]}
                                    placeholder="Confirmar Senha"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </>
                        )}
                    </View>
                )}
                <CustomButton
                    style={[commonStyles.button, {width: 100}]}
                    title="Entrar"
                    onPress={async () => {
                        setLoading(true);
                        try {
                            if (!askedPassword)   await submit();
                            else if (hasPassword) await authenticate();
                            else                  await createPassword();
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
            </View>
        </ScreenWrapper>
    )
} 
