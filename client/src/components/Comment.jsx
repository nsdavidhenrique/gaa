import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { useTheme }     from '../hooks/useTheme.js'
import { commonStyles } from '../styles/commonStyles';
import { brDateTime }   from '../utils/brDateTime'

export const Comment = ({data}) => {
    const theme = useTheme();
    const styles = commonStyles(theme)

    return(
       <View style={[styles.card ,{
            padding: 8,
            marginBottom: 3,
            width: '100%',
            backgroundColor: theme.colors.surface
        }]}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text style={styles.subTitleText}>{data.user}: </Text>
                <Text style={styles.labelText}>{brDateTime(data.createdAt)}</Text>
            </View>
            <Text style={styles.subTitleText}>{data.content}</Text>
       </View>
    )
}
