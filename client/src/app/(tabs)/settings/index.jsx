import { StatusBar } from 'expo-status-bar'
import { Text, View, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

export default function Analise() {
    const router = useRouter()
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <StatusBar style="auto" />
                <View>
                    <Button title="Sair" onPress={() => router.replace('(auth)/login')} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
