import React, { useState } from 'react'
import { Text, View, Button, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import { HOST } from '../utils/config'
import { loginStyle }    from '../styles/loginStylesheet';

// TODO remove from stack
export default function Login(){
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const submit = () => {
        
        setName("")
        setPassword("")
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
                        onPress={submit}
                    />
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}
