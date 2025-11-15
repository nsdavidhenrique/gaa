import React from 'react'

import {
    Alert,
    Text,
    View,
    ScrollView,
    Button,
    FlatList,
    RefreshControl
} from 'react-native'

import { ListItem }      from '../../../components/ListItem'
import { ScreenWrapper } from '../../../components/ScreenWrapper'
import { CustomButton }  from '../../../components/CustomButton'

import { useState, useEffect } from 'react'
import { useRouter }           from 'expo-router'
import { useFocusEffect }      from '@react-navigation/native'

import { Api } from '../../../services/api'

export default function Task() {
    const [loading, setLoading]           = useState(false)
    const [refreshing, setRefreshing]     = useState(false)
    const [tasks, setTasks]               = useState([])
    const [offset, setOffset]             = useState(0)
    const [hasMoreTasks, setHasMoreTasks] = useState(true)

    const router = useRouter()

    const fetchPending = async () => {
        setLoading(true)

        const response = await Api.getTaskList(true, 0, router)
        if(!response.ok){
            setLoading(false)
            return
        }

        const json = await response.json()
        setTasks(() => [...json.data])
        setLoading(false)
    }

    const fetchDone = async () => {
        if(!hasMoreTasks) return
        setLoading(true)

        const response = await Api.getTaskList(false, offset, router)
        if(!response.ok){
            setLoading(false)
            return
        }

        const json = await response.json()
        if(json.data.length < 5) setHasMoreTasks(false)
        setTasks(tasks => [...tasks, ...json.data])
        setOffset(prev => prev + 1)
        setLoading(false)
    }

    const onRefresh = async () => {
        setRefreshing(true)
        setHasMoreTasks(true)
        setOffset(0)
        await fetchPending()
        setRefreshing(false)
    }

    useFocusEffect(
        React.useCallback(() => {
            onRefresh()
        }, [])
    )

    useEffect(() => {
        fetchPending()
    }, [])

    // TODO remove 'carregar mais' button or change to 'carregar finalizadas', scroll down load more automatically
    return (
        <ScreenWrapper>
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
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
