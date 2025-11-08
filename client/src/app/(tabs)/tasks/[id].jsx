import React, { useState, useEffect }  from 'react';
import { Stack, useLocalSearchParams } from 'expo-router'
import { Alert, Text, View, Button }   from 'react-native';
import { useRouter }                   from 'expo-router'

import { HOST }          from '../../../utils/config'
import { ensureSession } from '../../../services/handleSession'
import { TaskDetail }    from '../../../components/taskDetail';

export default function TaskDetailScreen() {
    const { id }                = useLocalSearchParams();
    const [loading, setLoading] = useState(true)
    const [task, setTask]       = useState(null)

    const router = useRouter()

    const fetchTask = async () => {
        setLoading(true);
        const sessionToken = await ensureSession()

        const response = await fetch(`${HOST}/task?id=${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionToken}`,
            }
        });

        if(!response.ok){
            if(response.status == 401 || response.status == 422) handleSessionExpired(router)
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 500) Alert.alert("Internal server error")
        }

        const json = await response.json();
        setTask(json.data);
        setLoading(false);
    }

    const updateTaskStatus = async (newStatus) => {
        setLoading(true);
        const sessionToken = await ensureSession()

        const response = await fetch(`${HOST}/task`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionToken}`,
            },
            body: JSON.stringify({id: id, status: newStatus}) // TODO by
        });

        if(!response.ok){
            if(response.status == 401 || response.status == 422) handleSessionExpired(router)
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 500) Alert.alert("Internal server error")
        }

        setTask(prev => ({...prev, status: newStatus})) // TODO por, iniciado em
        setLoading(false);
    }

    useEffect(() => {
        fetchTask()
    }, [id])

    // TODO
    if(loading) return(<Text>Carregando...</Text>)
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
