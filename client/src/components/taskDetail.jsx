import {
    View,
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
    const theme = useTheme()
    const styles = commonStyles(theme)
    const local = getStyles(theme)

    return (
        <View style={{ marginBottom: 12 }}>
            
            <DetailBlock label="Área"        value={task.area} />
            <DetailBlock label="Responsável" value={task.target ? task.target : "Todos"} />
            <DetailBlock label="Descrição"   value={task.description} />

            <View style={local.block}>
                <Text style={styles.subTitleText}>Status</Text>

                <View style={local.statusRow}>
                    <Status status={task.status} />
                    {(task.status === "Em Andamento" || task.status === "Finalizado") && (
                        <Text style={styles.labelText}>Por: {task.updatedBy}</Text>
                    )}
                </View>

                {task.status === "Em Andamento" && (
                    <Text style={styles.labelText}>Iniciado em: {brDateTime(task.lastUpdate)}</Text>
                )}

                {task.status === "Finalizado" && (
                    <Text style={styles.labelText}>Finalizado em: {brDateTime(task.lastUpdate)}</Text>
                )}
            </View>

            <View style={local.block}>
                <Text style={styles.subTitleText}>Criado por</Text>
                <Text style={styles.bodyText}>{task.createdBy}</Text>
                <Text style={styles.bodyText}>Em:      {brDateTime(task.createdAt)}</Text>

                <Text style={styles.bodyText}>
                    Prazo: {brDateTime(task.deadline)}
                    {isLate(task.deadline) && (
                        <Text style={local.late}>  Atrasado!</Text>
                    )}
                </Text>
            </View>

        </View>
    )
}

const DetailBlock = ({ label, value }) => {
    const theme = useTheme()
    const styles = commonStyles(theme)
    const local = getStyles(theme)

    return (
        <View style={local.block}>
            <Text style={styles.subTitleText}>{label}</Text>
            <Text style={styles.bodyText}>{value}</Text>
        </View>
    )
}

const getStyles = (theme) =>
    StyleSheet.create({
        block: {
            paddingVertical: 12,
            borderBottomWidth: 0.3,
            borderBottomColor: theme.colors.borderColor,
        },

        statusRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginTop: 6,
            marginBottom: 4,
        },

        late: {
            color: theme.colors.alert,
            fontWeight: "600",
        },
    })
