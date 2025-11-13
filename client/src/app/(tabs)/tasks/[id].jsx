import {
    Alert,
    Text,
    View,
} from 'react-native';

import { ScreenWrapper } from '../../../components/ScreenWrapper'
import { CustomButton }  from '../../../components/CustomButton'
import { TaskDetail }    from '../../../components/taskDetail'

import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useEffect } from 'react';
import { useTheme }            from '../../../hooks/useTheme'     

import { commonStyles } from '../../../styles/commonStyles'

import { Api } from '../../../services/api'


export default function TaskDetailScreen() {
    const theme = useTheme();
    const styles = commonStyles(theme);
    const router = useRouter();

    const {id}                  = useLocalSearchParams();
    const [task, setTask]       = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchTask = async () => {
        setLoading(true)

        const response = await Api.getTask(id, router)
        if(!response.ok){
            if(reponse.status == 404) Alert.alert("Tarefa não encontrada")
            setLoading(false)
            return
        }

        const json = await response.json();
        setTask(json.data)
        setLoading(false)
    }

    const updateTaskStatus = async (newStatus) => {
        setLoading(true)

        const response = await Api.updateTask({id: id, status: newStatus}, router) // TODO by
        if(!response.ok){
            setLoading(false)
            return
        }

        setTask(prev => ({...prev, status: newStatus})) // TODO por, iniciado em, fetchTask()
        setLoading(false)
    }

    useEffect(() => {
        fetchTask()
    }, [id])

    // TODO
    if(loading) return(<View style={styles.centered}><Text>Carregando...</Text></View>)
    if(!task)   return(<View style={styles.centered}><Text>Não encontrado!</Text></View>)

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
