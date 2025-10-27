import { StyleSheet } from "react-native"

export const commonStyles = (theme) => {
    return StyleSheet.create({
        // Container
        screen:{
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        centered: {
            justifyContent: 'center',
            alignItems: 'center',
        },

        // Input
        input: {
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: theme.colors.background,
            font: theme.fonts.regular,
            fontSize: theme.fontSizes.body,
            textAlign: 'center',
            color: theme.colors.textPrimary,
        },

        // Button
        button: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 10,
            backgroundColor: theme.colors.accent,
        },
        buttonText: {
            font: theme.fonts.bold,
            fontSize: theme.fontSizes.subtitle,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        buttonPressed: {
            opacity: 0.8,
        },

    });
};
