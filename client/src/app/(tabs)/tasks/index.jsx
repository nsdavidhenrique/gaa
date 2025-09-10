import { useState, useEffect } from 'react'
import { Text, View, ScrollView, Button, FlatList, RefreshControl } from 'react-native';

import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useRouter } from 'expo-router';

import { TaskListItem } from '../../../components/taskListItem'
import { HOST } from '../../../utils/config'
import { getToken } from '../../../utils/jwt'

const router = useRouter()

export default function Task() {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    const [tasks, setTasks] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMoreTasks, setHasMoreTasks] = useState(true);

    const fetchPending = async () => {
        const token = await getToken()
        if(!token){  
            Alert.alert("Sessão expirou")
            router.replace("/(auth)/login")
        }

        setLoading(true);
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

        const token = await getToken()
        if(!token){
            console.erro("TODO usuário não autorizado")
        }

        setLoading(true);
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
        <>
            <Stack.Screen options={{ headerShown: false }}/>
            <SafeAreaView style={{flex: 1}}>
                <StatusBar style="auto" />
                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TaskListItem task={item} />
                    )}
                    ListEmptyComponent={() => (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text>Nenhuma tarefa encontrada.</Text>
                        </View>
                    )}
                />
                <Button
                    title="Carregar mais"
                    disabled={!hasMoreTasks || loading}
                    onPress={fetchDone}
                />
            </SafeAreaView>
        </>
    );
}
