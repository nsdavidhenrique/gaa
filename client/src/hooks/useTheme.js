import { useColorScheme } from 'react-native'
import { themes }         from '../styles/themes'

export const useTheme = () => {
    const colorScheme = useColorScheme()
    return colorScheme === 'dark' ? themes.dark : themes.light
}
