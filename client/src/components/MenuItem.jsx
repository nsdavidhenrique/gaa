import { TouchableOpacity, Text } from 'react-native'

import { useTheme } from '../hooks/useTheme'

export const MenuItem = ({ children, style, label, onPress }) => {
    const theme = useTheme()

    return(
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.6}
                style={[style, {
                    backgroundColor: theme.colors.card,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    marginBottom: 6,
                    borderWidth: 1,
                    borderColor: theme.colors.borderColor,
                }]}
            >
                <Text style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: theme.colors.textPrimary,
                }}>
                    {label}
                </Text>
                {children}
            </TouchableOpacity>
    )
}
