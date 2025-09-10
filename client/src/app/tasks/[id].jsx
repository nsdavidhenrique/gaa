import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router'
import { Text, View, Button } from 'react-native';

import { HOST } from '../../utils/config'
import { TaskDetail } from '../../components/taskDetail';

// TODO update status on react

export default function TaskDetailScreen() {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true)
    const [task, setTask] = useState(null)

    const fetchTask = async () => {
        setLoading(true);
        try{
            const response = await fetch(`${HOST}/task?id=${id}`);
            if(!response.ok) throw new Error(`HTTP ${response.status}`)

            const json = await response.json();
            setTask(json.data);
        } catch(error){
            // TODO
            console.error("TODO unable to fetch task detail:", error)
        } finally{
            setLoading(false);
        }
    }

    const updateTaskStatus = async (newStatus) => {
        setLoading(true);
        try {
            const response = await fetch(`${HOST}/task?id=${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({status: newStatus}) // TODO by
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            // TODO response.status != 204
            setTask(prev => ({...prev, status: newStatus}))
        } catch (error) {
            console.error("TODO: Failed to update task:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask()
    }, [id])

    // TODO
    if(loading) return(<Text>Carregando...</Text>)
    // TODO
    if(!task) return(<Text>Não encontrado!</Text>)

    return (
        <>
            <Stack.Screen options={{ title: ""}}/>
            <TaskDetail task={task} />
            {task.status == "Pendente" && <Button title="Iniciar" onPress={() => updateTaskStatus("Em Andamento")} disabled={loading} />}
            {task.status == "Em Andamento" && <Button title="Finalizar" onPress={() => updateTaskStatus("Finalizado")} disabled={loading} />}
        </>
    );
}
