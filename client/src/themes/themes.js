import light from './light'
import dark  from './dark'
import fonts from './fonts'

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
