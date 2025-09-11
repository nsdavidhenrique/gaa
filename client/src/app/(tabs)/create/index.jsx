import { useState, useEffect } from 'react';
import {
    Alert,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
    TextInput,
    Switch,
    StyleSheet,
    Button,
    Platform }                 from 'react-native';
import { StatusBar }           from 'expo-status-bar'
import { SafeAreaView }        from 'react-native-safe-area-context'
import { useRouter }           from 'expo-router'
import DropDownPicker          from 'react-native-dropdown-picker';
import DateTimePickerModal     from '@react-native-community/datetimepicker'
import DateTimePicker          from '@react-native-community/datetimepicker'
import { useForm, Controller } from 'react-hook-form'

import { HOST }                 from '../../../utils/config'
import { getToken }             from '../../../utils/jwt'
import { formStyle }            from '../../../styles/formStylesheet'
import { handleSessionExpired } from '../../../utils/handleSessionExpired'

export default function TaskForm() {
    const [loading, setLoading]       = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate]     = useState(new Date());
    const [users, setUsers]           = useState([]);
    const [userOpen, setUserOpen]     = useState(false);
    const [areas, setAreas]           = useState([]);
    const [areaOpen, setAreaOpen]     = useState(false);
    const {control, handleSubmit, reset, formState: {errors} } = useForm();

    const getUsers = async () => {
        const router = useRouter()
        const token  = await getToken()
        if(!token){
            handleSessionExpired(router)  
            return
        }

        try {
            const response = await fetch(`${HOST}/users`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            if(!response.ok) throw new Error(`HTTP ${response.status}`)

            const json = await response.json();
            if(json.data.length <= 0){
                setUsers([{label: "Todos", value: 0}])
            }else{
                setUsers([{label:"Todos", value:0}, ...json.data.map(item => ({
                    label: item.name,
                    value: item.id
                }))]);
            }
        } catch (err) {
            console.error("TODO: Unable to fetch users:", err);
        }
    };

    const getAreas = async () => {
        const router = useRouter()
        const token  = await getToken()
        if(!token){
            handleSessionExpired(router)  
            return
        }

        try {
            const response = await fetch(`${HOST}/areas`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            if(!response.ok) throw new Error(`HTTP ${response.status}`)

            const json = await response.json();
            if(json.data.length <= 0){
                setAreas([{label: "Todos", value: 0}])
            }else{
                setAreas(json.data.map(item => ({
                    label: item.name,
                    value: item.id
                })));
            }
        } catch (err) {
            console.error("TODO: Unable to fetch areas:", err);
        }
    };

    useEffect(() => {
        getUsers();
        getAreas();
    }, []);

    const postTask = async (data) => {
        const router = useRouter()
        const token  = await getToken()
        if(!token){
            handleSessionExpired(router)  
            return
        }

        setLoading(true)
        try{
            const response = await fetch(`${HOST}/createTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            })

            if(!response.ok) throw new Error('Failed to send data') // TODO better log

            reset()
        } catch(error){
            console.log("TODO: Failed to post task: ", error)
            // Alert.alert("Erro", "Não foi possível criar a tarefa")
        } finally{
            setLoading(false)
        }

    };

    const onSubmit = (data) => {
        Alert.alert(
            "Confirmar envio",
            "Tem certeza que criar tarefa?",
            [
                {text: "Cancelar", style: "cancel"},
                {text: "Confirmar", onPress: () => {postTask(data)}}
            ]
        )
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={formStyle.form}>
                        <View style={formStyle.container}>
                            <Text style={formStyle.label}>Responsável</Text>
                            {errors.target && <Text style={{ color: 'red' }}>{errors.target.message}</Text>}
                            <Controller
                                control={control}
                                name="targetId"
                                defaultValue={null}
                                rules={{required: "Responsável é obrigatório"}}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <DropDownPicker
                                        value={value}
                                        setValue={(callback) => {
                                            onChange(callback(value))
                                        }}
                                        onBlur={onBlur}
                                        items={users}
                                        open={userOpen}
                                        setOpen={setUserOpen}
                                        disabled={loading}
                                        placeholder="Selecione um responsável"
                                        zIndex={3000}
                                        zIndexInverse={1000}
                                        style={formStyle.dropDown}
                                    />
                                )}
                            />
                        </View>

                        <View style={formStyle.container}>
                            <Text style={formStyle.label}>Área</Text>
                            {errors.area && <Text style={{ color: 'red' }}>{errors.area.message}</Text>}
                            <Controller
                                control={control}
                                name="areaId"
                                defaultValue={null}
                                rules={{required: "Area é obrigatório"}}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <DropDownPicker
                                        value={value}
                                        setValue={(callback) => {
                                            onChange(callback(value))
                                        }}
                                        onBlur={onBlur}
                                        items={areas}
                                        open={areaOpen}
                                        setOpen={setAreaOpen}
                                        disabled={loading}
                                        placeholder="Selecione uma área"
                                        zIndex={2000}
                                        zIndexInverse={2000}
                                        style={formStyle.dropDown}
                                    />
                                )}
                            />
                        </View>

                        <View style={formStyle.container}>
                            <Text style={formStyle.label}>Prazo:</Text>
                            {errors.deadline && (
                                <Text style={{ color: 'red' }}>{errors.deadline.message}</Text>
                            )}

                            <Controller
                                control={control}
                                name="deadline"
                                defaultValue={null}
                                rules={{ required: "Prazo é obrigatório" }}
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <Button
                                            title={value ? value.toLocaleString() : "Selecionar"}
                                            onPress={() => {
                                                setTempDate(value || new Date());
                                                setShowPicker(true);
                                            }}
                                        />

                                        <Modal
                                            transparent={true}
                                            animationType="slide"
                                            visible={showPicker}
                                            onRequestClose={() => setShowPicker(false)}
                                        >
                                            <View style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0,0,0,0.4)',
                                            }}>
                                                <View style={{
                                                    margin: 20,
                                                    backgroundColor: '#121212',
                                                    borderRadius: 10,
                                                    padding: 20
                                                }}>
                                                    <DateTimePicker
                                                        value={tempDate}
                                                        mode="datetime"
                                                        is24Hour={true}
                                                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                                        onChange={(event, selectedDate) => {
                                                            if (selectedDate) setTempDate(selectedDate);
                                                        }}
                                                    />
                                                    <Button
                                                        title="Confirmar"
                                                        onPress={() => {
                                                            onChange(tempDate); // salva no formulário
                                                            setShowPicker(false);
                                                        }}
                                                    />
                                                    <Button
                                                        title="Cancelar"
                                                        onPress={() => setShowPicker(false)}
                                                    />
                                                </View>
                                            </View>
                                        </Modal>
                                    </>
                                )}
                            />
                        </View>

                        <View style={formStyle.container}>
                            <Text style={formStyle.label}>Descrição</Text>
                            {errors.description && <Text style={{ color: 'red' }}>{errors.description.message}</Text>}
                            <Controller
                                control={control}
                                name="description"
                                rules={{required: "Descrição é obrigatório"}}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder="Digite a descrição"
                                        editable={!loading}
                                        style={formStyle.textInput}
                                        multiline={true}
                                        numberOfLines={6}
                                    />
                                )}
                            />
                        </View>
                        <View style={formStyle.container}>
                            <Text>Urgente</Text>
                            <Controller
                                control={control}
                                name="urgent"
                                defaultValue="false"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <Switch
                                        value={value}
                                        onValueChange={onChange}
                                    />
                                )}
                            />
                        </View>
                        <Button
                            title="Criar"
                            onPress={handleSubmit(onSubmit)}
                            disabled={loading}
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
