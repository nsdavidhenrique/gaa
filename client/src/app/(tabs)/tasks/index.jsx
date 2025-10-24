import { useState, useEffect } from 'react'
import {
    Text,
    View,
    ScrollView,
    Button,
    FlatList,
    RefreshControl
} from 'react-native';

import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useRouter } from 'expo-router';

import { ensureSession, handleSessionExpired } from '../../../services/handleSession'
import { HOST }         from '../../../utils/config'
import { TaskListItem } from '../../../components/taskListItem'

export default function Task() {
    const [loading, setLoading]           = useState(false);
    const [refreshing, setRefreshing]     = useState(false);
    const [tasks, setTasks]               = useState([]);
    const [offset, setOffset]             = useState(0);
    const [hasMoreTasks, setHasMoreTasks] = useState(true);

    const router = useRouter()

    const fetchPending = async () => {
        setLoading(true);
        const sessionToken = await ensureSession()

        try{
            const response = await fetch(`${HOST}/taskList?pending=true`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionToken}`,
                }
            });

            if(response.status == 200){
                const json = await response.json();
                setTasks(() => [...json.data]);
                return
            }

            if(response.status == 401 || response.status == 422){
                handleSessionExpired(router)
                return
            }

            // TODO remove throw error
            if(!response.ok) throw new Error(`HTTP ${response.status}`)
        } catch(err){
            // TODO report network error
            console.error("Task::fetchPending::Network error: ", err);
        } finally {
            setLoading(false);
        }
    }

    const fetchDone = async () => {
        if(!hasMoreTasks) return
        setLoading(true);

        const sessionToken = await ensureSession()

        try{
            const response = await fetch(`${HOST}/taskList?pending=false&offset=${offset}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionToken}`,
                }
            });

            if(response.status == 200){
                const json = await response.json();
                if(json.data.length < 5) setHasMoreTasks(false)
                setTasks(tasks => [...tasks, ...json.data]);
                setOffset(prev => prev + 1);
                return
            }

            if(response.status == 401 || response.status == 422){
                handleSessionExpired(router)
                return
            }

            // TODO remove throw error
            if(!response.ok) throw new Error(`HTTP ${response.status}`)
        } catch(error){
            // TODO report network error
            console.error("Task::fetchDone::Network error: ", err);
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
