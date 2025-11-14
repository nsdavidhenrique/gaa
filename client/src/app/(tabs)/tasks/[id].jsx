import {
    Alert,
    Text,
    View,

    FlatList,
} from 'react-native';

import { ScreenWrapper } from '../../../components/ScreenWrapper'
import { CustomButton }  from '../../../components/CustomButton'
import { TaskDetail }    from '../../../components/TaskDetail'
import { Comment }       from '../../../components/Comment'

import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useEffect } from 'react';
import { useTheme }            from '../../../hooks/useTheme'     

import { commonStyles } from '../../../styles/commonStyles'

import { Api } from '../../../services/api'


export default function TaskDetailScreen() {
    const theme = useTheme();
    const styles = commonStyles(theme);
    const router = useRouter();

    const {id}                    = useLocalSearchParams();
    const [task, setTask]         = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading]   = useState(true)

    const getTask = async () => {
        setLoading(true)

        const response = await Api.getTask(id, router)
        if(!response.ok){
            setLoading(false)
            return
        }
        const json = await response.json();
        setTask(json.data)

        setLoading(false)
    }

    const getComments = async () => {
        setLoading(true)

        const response = await Api.getComments(id, router)
        if(!response.ok){
            setLoading(false)
            return
        }
        const body = await response.json();
        setComments(body.data)

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

    const addComment = async (text) => {
        setLoading(true)

        const response = await Api.createComment({id: id, content: text}, router)
        if(!response.ok){
            setLoading(false)
            return
        }
        setComments([])
        getComments()
        
        setLoading(false)
    }

    const addCommentPrompt = () => {
        setLoading(true)
        Alert.prompt(
            "Novo comentário",
            "",
            [
                {text: "Cancelar" },
                {text: "Adicionar", onPress: async (text) => {await addComment(text)}}
            ]
        )
        setLoading(false)
    }

    useEffect(() => {
        getTask()
        getComments()
    }, [id])

    // TODO
    if(loading) return(<View style={styles.centered}><Text>Carregando...</Text></View>)
    if(!task)   return(<View style={styles.centered}><Text>Não encontrado!</Text></View>)

    return (
        <ScreenWrapper>
            <Stack.Screen options={{ headerShown:false }}/>

            <View style={{
                flex: 1,
                marginHorizontal: 5,
                paddingHorizontal: 3,
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
            }}>
                <TaskDetail task={task} />

                <Text style={styles.titleText}>Comentários</Text>

                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <Comment data={item} />}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text>Nenhum Commentário</Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={true}
                    style={{
                        marginBottom: 16,
                        flexGrow: 0,
                    }}
                />

                <CustomButton
                    style={{ marginBottom: 10 }}
                    title="Adicionar Comentário"
                    onPress={() => addCommentPrompt()}
                    disabled={loading}
                />

                {task.status == "Pendente" &&
                <CustomButton
                    style={{ marginBottom: 10 }}
                    title="Iniciar"
                    onPress={() => updateTaskStatus("Em Andamento")}
                    disabled={loading}
                />}

                {task.status == "Em Andamento" &&
                <CustomButton
                    style={{ marginBottom: 10 }}
                    title="Finalizar"
                    onPress={() => updateTaskStatus("Finalizado")}
                    disabled={loading}
                />}
            </View>
        </ScreenWrapper>
    );
}
