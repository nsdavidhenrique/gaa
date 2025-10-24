import { StatusBar } from 'expo-status-bar'
import { Text, View, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { logout } from '../../../services/handleSession'

export default function Settings() {
    const router = useRouter()
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <StatusBar style="auto" />
                <View>
                    <Button title="Sair" onPress={() => logout(router)} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
