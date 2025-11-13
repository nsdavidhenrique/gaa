import {
    Text,
    View,
    TextInput,
    Alert
} from 'react-native';

import { ScreenWrapper } from '../../components/ScreenWrapper'
import { CustomButton }  from '../../components/CustomButton'

import { useState, useEffect } from 'react'
import { useRouter }           from 'expo-router';
import { useTheme }            from '../../hooks/useTheme.js'

import { commonStyles }  from '../../styles/commonStyles';

import { Api }   from '../../services/api'
import { login } from '../../services/handleSession'

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

    const submit = async () => {
        if(name == "") {
            Alert.alert("Insira o usuário")
            return
        }

        let response = await Api.login(name, router)
        if(!response.ok){
            if(response.status == 404) Alert.alert("Usuário inválido")
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

        let response = await Api.authenticate(name, password, router)
        if(!response.ok){
            if(response.status == 401) Alert.alert("Usuário ou senha inválida")
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

        let response = await Api.createPassword(name, newPassword, router)
        if(!response.ok){
            if(response.status == 404) Alert.alert("Usuário inválido")
            return
        }

        let res   = await Api.authenticate(name, newPassword, router)
        let token = await res.json()
        await login(router, token.data);
    }

    return(
        <ScreenWrapper style={[styles.centered, { backgroundColor: theme.colors.primary } ]}>
            <View style={[styles.centered, styles.card, {
                paddingVertical: 40,
                paddingHorizontal: 25,
                width: '85%',
                backgroundColor: theme.colors.background,
            }]}>
                <View style = {{ paddingBottom: 15 }}>
                    <Text style={styles.titleText}>Entrar</Text>
                </View>

                <View style={{ paddingBottom: 15, width: '100%' }}>
                    <TextInput
                        style={[styles.input,{alignSelf: 'stretch'}]}
                        placeholder="Usuario"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {askedPassword && (
                    <View style={{paddingBottom: 15, width:'100%'}}>
                        {hasPassword ? (
                            <TextInput
                                style={[styles.input, {alignSelf: 'stretch'}]}
                                placeholder="Senha"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        ) : (
                            <>
                                <TextInput
                                    style={[styles.input, {alignSelf: 'stretch', marginBottom: 8}]}
                                    placeholder="Nova Senha"
                                    secureTextEntry
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TextInput
                                    style={[styles.input, {alignSelf: 'stretch'}]}
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
                    style={[commonStyles.button, {width: '100%'}]}
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
