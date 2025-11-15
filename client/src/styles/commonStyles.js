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
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        card: {
            borderRadius: 16,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: {width: 0, height: 3},
            shadowRadius: 8,
        },

        // Text
        titleText: {
            font: theme.fonts.bold,
            fontSize: theme.fontSizes.title,
            color: theme.colors.textPrimary
        },
        subTitleText: {
            font: theme.fonts.bold,
            fontSize: theme.fontSizes.subTitle,
            color: theme.colors.textPrimary
        },
        bodyText: {
            font: theme.fonts.regular,
            fontSize: theme.fontSizes.body,
            color: theme.colors.textPrimary
        },
        labelText: {
            font: theme.fonts.regular,
            fontSize: theme.fontSizes.body,
            color: theme.colors.textSecondary
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
            fontSize: theme.fontSizes.subTitle,
            color: theme.colors.textTernary,
            textAlign: 'center',
        },
        buttonPressed: {
            opacity: 0.8,
        },
        buttonDisabled: {
            opacity: 0.5
        }

    })
}
