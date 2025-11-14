import { useColorScheme } from 'react-native';
import { themes } from '../themes/themes';

export const useTheme = () => {
    const colorScheme = useColorScheme();
    return colorScheme === 'dark' ? themes.dark : themes.light;
    //return themes.dark
};
