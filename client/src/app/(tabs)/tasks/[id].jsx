import {
    Alert,
    Text,
    View,
} from 'react-native';

import { Stack, useLocalSearchParams } from 'expo-router'

import { useState, useEffect } from 'react';
import { useRouter }           from 'expo-router'

import { HOST }          from '../../../utils/config'
import { ensureSession } from '../../../services/handleSession'
import { ScreenWrapper } from '../../../components/ScreenWrapper'
import { CustomButton }  from '../../../components/CustomButton'
import { TaskDetail }    from '../../../components/taskDetail'

export default function TaskDetailScreen() {
    const { id }                = useLocalSearchParams();
    const [task, setTask]       = useState(null)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    const fetchTask = async () => {
        setLoading(true)
        const sessionToken = await ensureSession()

        const response = await fetch(`${HOST}/task?id=${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionToken}`
            }
        })

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
    if(loading) return(<View style={{justifyContent: 'center', alignItems: 'center'}}><Text>Carregando...</Text></View>)
    if(!task)   return(<View style={{justifyContent: 'center', alignItems: 'center'}}><Text>Não encontrado!</Text></View>)

    return (
        <ScreenWrapper>
            <Stack.Screen options={{ headerShown:false }}/>
            <TaskDetail task={task} />
            {task.status == "Pendente" &&
                <CustomButton
                    style={{ alignSelf: 'center', width: 150, marginBottom: 10 }}
                    title="Iniciar"
                    onPress={() => updateTaskStatus("Em Andamento")}
                    disabled={loading}
                />}
            {task.status == "Em Andamento" &&
                <CustomButton
                    style={{ alignSelf: 'center', width: 150, marginBottom: 10 }}
                    title="Finalizar"
                    onPress={() => updateTaskStatus("Finalizado")}
                    disabled={loading}
                />}
        </ScreenWrapper>
    );
}
