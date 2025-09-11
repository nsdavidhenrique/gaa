import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

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
