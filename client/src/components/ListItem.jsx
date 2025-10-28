import {
    Pressable,
    View,
    Text,
    StyleSheet
} from 'react-native';

import { useRouter }    from 'expo-router'
import { useTheme }     from '../hooks/useTheme.js'
import { isLate }       from '../utils/isLate'
import { commonStyles } from '../styles/commonStyles';
import { Status }       from './Status'

export const ListItem = ({task}) => {
    const router = useRouter();
    const theme  = useTheme()
    const styles = commonStyles(theme)

    const getDescription = (description) => {
        if(description.length > 36)
            return description.substring(0, 33).concat('...')
        return description
    }

    const defaultStyle = StyleSheet.create({
        item: {
            flex: 1,
            height: 110,
            marginBottom: 5,
            paddingLeft: 25,
            paddingRight: 25,
            justifyContent: 'center',
            backgroundColor: theme.colors.surface,
        },
    })

    return(
        <Pressable onPress={() => {
            router.navigate(`tasks/${task.id}`)}
        }>
            <View style={defaultStyle.item}>
                <Text style={styles.titleText}>{getDescription(task.description)}</Text>
                <Text style={styles.bodyText}>Prazo: {(new Date(task.deadline)).toLocaleString("pt-BR")}</Text>
                <View style={styles.row}>
                    <Status status={task.status} />
                    {task.urgent == true   && <Text style={[styles.labelText, {marginLeft: 10}]}>Urgente!</Text>}
                    {isLate(task.deadline) && <Text style={[styles.labelText, {marginLeft: 10}]}>Atrasado!</Text>}
                </View>
            </View>
        </Pressable>
    )
}
