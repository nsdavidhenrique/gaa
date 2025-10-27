import React, { useState, useEffect } from 'react'
import {
    Text,
    View,
    Button,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';

import { useRouter }    from 'expo-router';
import { useTheme } from '../../hooks/useTheme.js'

import { ScreenWrapper } from '../../components/ScreenWrapper'
import { CustomButton }  from '../../components/CustomButton'

import { HOST }         from '../../utils/config'
import { login }        from '../../services/handleSession'
import { commonStyles } from '../../styles/commonStyles';


export default function Login(){
    const [name,     setName]     = useState("")
    const [password, setPassword] = useState("")
    const [loading,  setLoading]  = useState(false)

    const router = useRouter()
    const theme  = useTheme()
    const styles = commonStyles(theme)

    useEffect(() => {
        // TODO if logged in go to taskList
    }, [])

    const submit = async () => {
        if(name == "" || password == ""){
            Alert.alert("Insira usuário e senha")
            return
        }

        let response = await fetch(`${HOST}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': name, 'password': password})
        })

        if(!response.ok){
            if(response.status == 401){
                Alert.alert("Usuário ou senha inválida")
            }
            if(response.status == 400){
                Alert.alert("Bad request")
            }
            setPassword("")
            return
        }
        
        let body = await response.json()
        await login(router, body.data);
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
                <View style={{paddingBottom: 8}}>
                    <TextInput
                        style={[styles.input,{width: 200}]}
                        placeholder="Senha"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <CustomButton
                    style={[commonStyles.button, {width: 100}]}
                    title="Entrar"
                    onPress={submit}
                />
            </View>
        </ScreenWrapper>
    )
}
