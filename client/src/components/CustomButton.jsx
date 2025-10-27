import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { useTheme } from '../hooks/useTheme'
import { commonStyles } from '../styles/commonStyles'

export const CustomButton = ({ title, onPress, style }) => {
    const theme = useTheme();
    const styles = commonStyles(theme)

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                style,
            ]}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
}

