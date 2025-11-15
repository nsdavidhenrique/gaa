import { Text, StyleSheet } from 'react-native'

export const Status = ({statusId, status}) => {
    const styles = getStyles(null)

    if(statusId == 3 || status == "Finalizado")        return <Text style={styles.statusDone}>FINALIZADO</Text>
    else if(statusId == 2 || status == "Em Andamento") return <Text style={styles.statusInProgress}>EM ANDAMENTO</Text>
    else                                               return <Text style={styles.statusPending}>PENDENTE</Text>
}

const getStyles = (theme) =>
    StyleSheet.create({
        statusDone:{
            color: 'green',
            backgroundColor: '#DFFFD6',
            borderRadius: 100,
            padding: 5,
        },
        statusInProgress:{
            color: 'orange',
            backgroundColor: '#FFE5B4',
            borderRadius: 100,
            padding: 5,
        },
        statusPending:{
            color: 'red',
            backgroundColor: '#FFB3B3',
            borderRadius: 100,
            padding: 5,
        },
    })
