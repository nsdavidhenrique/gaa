import { useState, useEffect } from 'react'
import { Text, View, ScrollView, Button, FlatList, RefreshControl } from 'react-native';

import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useRouter } from 'expo-router';

import { HOST }                 from '../../../utils/config'
import { getToken }             from '../../../utils/jwt'
import { handleSessionExpired } from '../../../utils/handleSessionExpired'
import { TaskListItem }         from '../../../components/taskListItem'

export default function Task() {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    const [tasks, setTasks] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMoreTasks, setHasMoreTasks] = useState(true);

    const router = useRouter()

    const fetchPending = async () => {
        setLoading(true);

        const token = await getToken()
        if(!token){
            handleSessionExpired(router)  
            return
        }

        try{
            const response = await fetch(`${HOST}/taskList?pending=true`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            if(!response.ok) throw new Error(`HTTP ${response.status}`)

            const json = await response.json();
            setTasks(() => [...json.data]);
        } catch(err){
            //TODO
            console.error("TODO: Unable to fetch tasks:", err);
        } finally {
            setLoading(false);
        }
    }

    const fetchDone = async () => {
        if(!hasMoreTasks) return
        setLoading(true);

        const token = await getToken()
        if(!token) handleSessionExpired(router)  

        try{
            const response = await fetch(`${HOST}/taskList?pending=false&offset=${offset}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            if(!response.ok) throw new Error(`HTTP ${response.status}`)

            const json = await response.json();
            if(json.data.length < 5) setHasMoreTasks(false)

            setTasks(tasks => [...tasks, ...json.data]);
            setOffset(prev => prev + 1);
        } catch(error){
            console.error("TODO: Unable to fetch done tasks:", error);
        } finally {
            setLoading(false);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setOffset(0);
        setHasMoreTasks(true);
        await fetchPending();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchPending();
    }, [])

    return (
        <SafeAreaProvider>
            <Stack.Screen options={{ headerShown: false }}/>
            <StatusBar style="auto" />
            <SafeAreaView style={{flex: 1}}>
                <ScrollView
                    style={{flexGrow: 1}}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    {tasks.map(task => (
                        <TaskListItem key= {task.id} task={task} />
                    ))}
                </ScrollView>
                <Button
                    title="Carregar mais"
                    disabled={!hasMoreTasks || loading}
                    onPress={fetchDone}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
