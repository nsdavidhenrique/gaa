import React, { useState, useEffect } from 'react'
import { Text, View, Button, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';

import { HOST } from '../../utils/config'
import { saveToken, deleteToken } from '../../utils/jwt'
import { loginStyle }    from '../../styles/loginStylesheet';


export default function Login(){
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    useEffect(() => {
        deleteToken()
    },[])

    const onSubmit = async () => {
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
        await saveToken(body.data);
        router.replace("/(tabs)/tasks")
    }

    return(
        <>
            <StatusBar />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={loginStyle.container}>
                    <View style={loginStyle.field}>
                        <TextInput
                            style={loginStyle.input}
                            placeholder="Usuario"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={loginStyle.field}>
                        <TextInput
                            style={loginStyle.input}
                            placeholder="Senha"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <Button
                        title="Entrar"
                        onPress={onSubmit}
                    />
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}
