import { useColorScheme } from 'react-native';
import { themes } from '../themes/themes';

export const useTheme = () => {
    const colorScheme = useColorScheme(); // 'light' ou 'dark'
    return colorScheme === 'dark' ? themes.dark : themes.light;
};
