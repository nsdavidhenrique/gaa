import React, { useState, useEffect }  from 'react';
import { Stack, useLocalSearchParams } from 'expo-router'
import { Alert, Text, View, Button }   from 'react-native';
import { useRouter }                   from 'expo-router'

import { HOST }                 from '../../../utils/config'
import { getToken }             from '../../../utils/jwt'
import { handleSessionExpired } from '../../../utils/handleSessionExpired'
import { TaskDetail }           from '../../../components/taskDetail';

export default function TaskDetailScreen() {
    const { id }                = useLocalSearchParams();
    const [loading, setLoading] = useState(true)
    const [task, setTask]       = useState(null)

    const fetchTask = async () => {
        setLoading(true);

        const router = useRouter()
        const token  = await getToken()
        if(!token){
            handleSessionExpired(router)  
            return
        }

        try{
            const response = await fetch(`${HOST}/task?id=${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
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

        const router = useRouter()
        const token  = await getToken()
        if(!token){
            handleSessionExpired(router)  
            return
        }

        try {
            const response = await fetch(`${HOST}/task?id=${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({status: newStatus}) // TODO by
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            // TODO response.status != 204
            setTask(prev => ({...prev, status: newStatus})) // TODO por, iniciado em
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
