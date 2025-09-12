import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router'

export default function Analise() {
    return (
        <>
            <StatusBar style="auto" />
            <View>
                <Button title="Sair" onPress{router.replace('(auth)/login')}/>
            </View>
        </>
    )
}
