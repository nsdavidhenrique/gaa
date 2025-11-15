import { PixelRatio } from 'react-native'

const scale = PixelRatio.getFontScale()

export default {
    fonts: {
        regular: 'System',
        bold: 'System'
    },
    fontSizes: {
        title: 24 * scale,
        subTitle: 18 * scale,
        body: 14 * scale
    }
}
