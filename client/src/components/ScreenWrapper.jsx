import React from 'react'
import { Keyboard, Pressable } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { TapGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTheme } from '../hooks/useTheme'
import { commonStyles } from '../styles/commonStyles'

export const ScreenWrapper = ({ children, style }) =>{
    const theme = useTheme();
    const styles = commonStyles(theme)

    return(
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <StatusBar style="auto"/>
                <TapGestureHandler style={{flex: 1}} onActivated={Keyboard.dismiss}>
                    <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>
                </TapGestureHandler>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}
