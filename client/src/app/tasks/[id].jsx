import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router'
import { Text, View, Button } from 'react-native';

import { HOST } from '../../utils/config'
import { TaskDetail } from '../../components/taskDetail';

export default function TaskDetailScreen() {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true)
    const [task, setTask] = useState(null)

    const fetchTaskDetails = async () => {
        setLoading(true);
        try{
            const response = await fetch(`${HOST}/taskDetails?id=${id}`);
            const data = await response.json();
            //TODO handle empty object
            setTask(data);
        } catch{
            // TODO
            console.log("TODO unable to fetch task detail")
        } finally{
            setLoading(false);
        }
    }

    const updateTaskStatus = async (newStatus) => {
        console.log(`TODO updateTaskStatus(${newStatus})`)
        //setLoading(true);
        //try {
        //    const response = await fetch(`${HOST}/updateTask`, {
        //        method: "POST",
        //        headers: { "Content-Type": "application/json" },
        //        body: JSON.stringify({ id: id, status: newStatus, TODO: BY })
        //    });
        //    const data = await response.json();

        //    if (data.success) {
        //        setTask(prev => ({ ...prev, status: newStatus }));
        //    } else {
        //        console.error("TODO: Falha ao atualizar task:", data.error);
        //    }
        //} catch (err) {
        //    console.error("TODO: Erro ao atualizar task:", err);
        //} finally {
        //    setLoading(false);
        //}
    };

    useEffect(() => {
        fetchTaskDetails()
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
