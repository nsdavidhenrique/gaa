import light from './light'
import dark  from './dark'
import fonts from './fonts'
// TODO change file name to themes
export const themes = {
    light: {
        ...light,
        ...fonts
    },
    dark: {
        ...dark,
        ...fonts
    }
}
