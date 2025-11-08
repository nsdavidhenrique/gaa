import { useState, useEffect } from 'react'
import {
    Alert,
    Text,
    View,
    ScrollView,
    Button,
    FlatList,
    RefreshControl
} from 'react-native';

import { Stack, useRouter } from 'expo-router';

import { ensureSession, handleSessionExpired } from '../../../services/handleSession'
import { HOST }         from '../../../utils/config'

import { ListItem }      from '../../../components/ListItem'
import { ScreenWrapper } from '../../../components/ScreenWrapper'
import { CustomButton }  from '../../../components/CustomButton'

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

        const response = await fetch(`${HOST}/taskList?pending=true`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${sessionToken}`}
        });

        if(!response.ok){
            if(response.status == 401 || response.status == 422) handleSessionExpired(router)
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 500) Alert.alert("Internal Server Error")
            setLoading(false)
            return
        }

        const json = await response.json();
        setTasks(() => [...json.data]);
        setLoading(false);
    }

    const fetchDone = async () => {
        if(!hasMoreTasks) return
        setLoading(true);
        const sessionToken = await ensureSession()

        const response = await fetch(`${HOST}/taskList?pending=false&offset=${offset}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${sessionToken}`}
        });

        if(!response.ok){
            if(response.status == 401 || response.status == 422) handleSessionExpired(router)
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 500) Alert.alert("Internal Server Error")
            setLoading(false)
            return
        }

        const json = await response.json();
        if(json.data.length < 5) setHasMoreTasks(false)
        setTasks(tasks => [...tasks, ...json.data]);
        setOffset(prev => prev + 1);
        setLoading(false);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setHasMoreTasks(true);
        setOffset(0);
        await fetchPending();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchPending();
    }, [])

    return (
        <ScreenWrapper>
            <Stack.Screen options={{ headerShown: false }}/>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ListItem task={item} />}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 20,
                }}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Nenhuma tarefa pendente</Text>
                    </View>
                }
            />
            <CustomButton
                style={{width: 180, height: 40, alignSelf: 'center', marginBottom: 10}}
                title="Carregar mais"
                disabled={!hasMoreTasks || loading}
                onPress={fetchDone}
            />
        </ScreenWrapper>
    )
}
