import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { useTheme }     from '../hooks/useTheme.js'
import { commonStyles } from '../styles/commonStyles';
import { brDateTime }   from '../utils/brDateTime'

export const Comment = ({ data }) => {
    const theme  = useTheme()
    const styles = commonStyles(theme)
    const local  = getStyles(theme)

    return (
        <View style={[styles.card, local.card]}>
            <View style={local.headerRow}>
                <Text style={styles.subTitleText}>{data.user}</Text>
                <Text style={styles.labelText}>{brDateTime(data.createdAt)}</Text>
            </View>
            <Text style={styles.bodyText}>{data.content}</Text>
        </View>
    )
}

const getStyles = (theme) =>
    StyleSheet.create({
        card: {
            width: "100%",
            marginBottom: 3,
            paddingVertical: 10,
            paddingHorizontal: 14,
            backgroundColor: theme.colors.card,
            borderRadius: 12,
        },

        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 6,
        },
    })
