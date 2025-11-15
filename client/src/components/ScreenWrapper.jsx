import { Keyboard, Pressable }            from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar }                      from 'expo-status-bar'

import { useTheme }     from '../hooks/useTheme'
import { commonStyles } from '../styles/commonStyles'

export const ScreenWrapper = ({ children, style }) =>{
    const theme = useTheme()
    const styles = commonStyles(theme)

    return(
        <SafeAreaProvider>
            <StatusBar style="auto"/>
            <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                <SafeAreaView style={[styles.screen, style]}>
                    {children}
                </SafeAreaView>
            </Pressable>
        </SafeAreaProvider>
    )
}
