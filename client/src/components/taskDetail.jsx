import {
    View,
    ScrollView,
    Text,
    StyleSheet
} from 'react-native'

import { useState, useEffect } from 'react'
import { useTheme}             from '../hooks/useTheme'

import { commonStyles } from '../styles/commonStyles'
import { Status }       from './Status'
import { isLate }       from '../utils/isLate'
import { brDateTime }   from '../utils/brDateTime'

export const TaskDetail = ({ task }) => {
    const theme  = useTheme()
    const styles = commonStyles(theme)


    const defaultStyle = StyleSheet.create({
        fieldContainer: {
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderColor,
        },
        isLate: {
            color: theme.colors.alert,
            marginLeft: 10,
        },
        statusContainer:{
            ...styles.row,
            paddingTop: 10,
        }
    });

    // TODO urgent is not on the list
    return(
        <ScrollView>
            <View style={defaultStyle.fieldContainer}>
                <Text style={styles.subTitleText}>Área:</Text>
                <Text style={styles.titleText}>{task.area}</Text>
            </View>
            <View style={defaultStyle.fieldContainer}>
                <Text style={styles.subTitleText}>Responsável:</Text>
                <Text style={styles.titleText}>{task.target ? task.target: 'Todos'}</Text>
            </View>
            <View style={defaultStyle.fieldContainer}>
                <Text style={styles.subTitleText}>Descrição:</Text>
                <Text style={styles.titleText}>{task.description}</Text>
            </View>
            <View style={defaultStyle.fieldContainer}>
                <Text style={styles.subTitleText}>Status: </Text>
                <View style={defaultStyle.statusContainer}>
                    <Status status={task.status} />
                    {(task.status == "Em Andamento" || task.status == "Finalizado") ? <Text style={styles.subTitleText}> Por: {task.updatedBy}</Text> : ""}
                </View>
                {task.status == "Em Andamento" ? <Text style={styles.subTitleText}> Iniciado em: {brDateTime(task.lastUpdate)}</Text>   : ""}
                {task.status == "Finalizado"   ? <Text style={styles.subTitleText}> Finalizado em: {brDateTime(task.lastUpdate)}</Text> : ""}
            </View>
            <View style={defaultStyle.fieldContainer}>
                <Text style={styles.subTitleText}>Criado por: {task.createdBy}</Text>
                <Text style={styles.subTitleText}>Em: {brDateTime(task.createdAt)}</Text>
                <Text style={styles.subTitleText}>
                    Prazo: {(new Date(task.deadline)).toLocaleString("pt-BR")} {isLate(task.deadline) && <Text style={defaultStyle.isLate}> Atrasado!</Text>}
                </Text>
            </View>
            <View style={defaultStyle.fieldContainer}>
                <Text style={styles.subTitleText}>Comentários:</Text>
                <Text>TODO!!!</Text>
            </View>
        </ScrollView>
    )
}
