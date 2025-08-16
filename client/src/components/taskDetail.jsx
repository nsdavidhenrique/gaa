import React, { useState, useEffect, useContext } from 'react'
import { View, ScrollView, Text, Button } from 'react-native'
import { useSearchParams } from 'expo-router'

import { taskStyle }    from '../styles/taskStylesheet';
import { TaskContext, TaskProvider }  from '../context/taskContext'
import { TaskRenderStatus } from './taskRenderStatus'
import { isLate } from '../utils/isLate'

export default function TaskDetail({ id }){
    const { getTaskDetails } = useContext(TaskContext);
    const [ task, setTask ] = useState(null)

    useEffect(() => {
        const fetchTaskDetails = async () => {
            const taskDetails = await getTaskDetails(id);
            setTask(taskDetails);
            //TODO setLoading(false);
        }

        fetchTaskDetails()
    }, [id, getTaskDetails])

    if(!task){
        return(
            <Text>Not Found!</Text>
        )
    }

    return(
        <>
            <ScrollView style={taskStyle.container}>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Área:</Text>
                    <Text style={taskStyle.detailContent}>{task.area}</Text>
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Responsável:</Text>
                    <Text style={taskStyle.detailContent}>{task.target}</Text>
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Descrição:</Text>
                    <Text style={taskStyle.detailContent}>{task.description}</Text>
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Status: </Text>
                    <View style={taskStyle.detailStatusContainer}>
                        <TaskRenderStatus status={task.status} />
                        <Text style={taskStyle.detailContent}> Por: {task.target}</Text>
                    </View>
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Criado por: {task.createdBy}</Text>
                    <Text style={taskStyle.detailHeader}>Em: {(new Date(task.createdAt)).toLocaleString("pt-BR")}</Text>
                    <Text style={taskStyle.detailHeader}>
                        Prazo: {(new Date(task.deadline)).toLocaleString("pt-BR")}
                        {isLate(task.deadline) && <Text style={taskStyle.detailLate}> Atrasado!</Text>}
                    </Text>
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Comentários:</Text>
                    <Text>{}</Text>
                </View>
                <Button title="Finalizar"/>
            </ScrollView>
        </>
    )
}

