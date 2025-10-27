import React from 'react';
import { useRouter } from 'expo-router'
import { Pressable, View, Text } from 'react-native';

import { taskStyle } from '../styles/taskStylesheet';
import { TaskRenderStatus } from './taskRenderStatus'
import { isLate } from '../utils/isLate'

export const ListItem = ({task}) => {
    const router = useRouter();

    const getDescription = (description) => {
        if(description.length > 36){
            let buffer = description.substring(0, 33).concat('...')
            return buffer
        }
        return description
    }

    const openDetail = (id) => {
        router.navigate(`tasks/${id}`)
    }

    return(
        <Pressable onPress={() => openDetail(task.id)}>
            <View style={taskStyle.listItem}>
                <Text style={taskStyle.listItemDescription}>{getDescription(task.description)}</Text>
                <Text style={taskStyle.listItemSubDescription}>Prazo: {(new Date(task.deadline)).toLocaleString("pt-BR")}</Text>
                <View style={taskStyle.listItemStatusContainer}>
                    <TaskRenderStatus status={task.status} />
                    {task.urgent == true && <Text style={taskStyle.listUrgent}>Urgente!</Text>}
                    {isLate(task.deadline) && <Text style={taskStyle.listLate}>Atrasado!</Text>}
                </View>
            </View>
        </Pressable>
    )
}
