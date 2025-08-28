import { useState, useEffect } from 'react'
import { Text, ScrollView, Button, FlatList } from 'react-native';

import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useRouter } from 'expo-router';

import { TaskListItem } from '../../components/taskListItem'
import { HOST } from '../../utils/config'

export default function Task() {
    const [loading, setLoading] = useState(false);
    
    const [tasks, setTasks] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMoreTasks, setHasMoreTasks] = useState(true);

    const fetchPending = async () => {
        setLoading(true);
        try{
            const response = await fetch(`${HOST}/taskList?pending=true`);
            const data = await response.json();
            setTasks(() => [...data]);
        } catch(err){
            //TODO
            console.error("TODO: Unable to fetch tasks:", err);
        } finally {
            setLoading(false);
        }
    }

    const fetchDone = async () => {
        setLoading(true);
        try{
            const response = await fetch(`${HOST}/taskList?pending=false&offset=${offset}`);
            const data = await response.json();
            if(data.length > 0){
                setTasks(tasks => [...tasks, ...data]);
                setOffset(prev => prev + 1);
            } else{
                setHasMoreTasks(false);
            }
        } catch(err){
            //TODO
            console.error("TODO: Unable to fetch tasks:", err);
        } finally {
            setLoading(false);
        }
    }

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
                />
                <Button
                    title="Carregar Mais"
                    onPress={fetchDone}
                    disabled={!hasMoreTasks || loading}
                />
            </SafeAreaView>
        </>
    );
}
