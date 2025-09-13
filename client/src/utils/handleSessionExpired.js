import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

// TODO change file name to HandleSession and add function login and logout
// TODO move to services/

export const handleSessionExpired = (router) => {
    Alert.alert(
        "Sessão expirada",
        "Sua sessão expirou, faça login novamente",
        [{
            text: "Voltar", onPress: () => {
                router.replace("/(auth)/login")
        }}
    ])
}
