import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { useTheme } from '../hooks/useTheme'
import { commonStyles } from '../styles/commonStyles'

export const CustomButton = ({ title, onPress, style, disabled }) => {
    const theme = useTheme();
    const styles = commonStyles(theme)

    return (
        <Pressable
            onPress={onPress}
            disabled={true && disabled}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                disabled && styles.buttonDisabled,
                style,
            ]}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
}

