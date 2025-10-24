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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useRouter }           from 'expo-router'
import DropDownPicker          from 'react-native-dropdown-picker';
import DateTimePickerModal     from '@react-native-community/datetimepicker'
import DateTimePicker          from '@react-native-community/datetimepicker'
import { useForm, Controller } from 'react-hook-form'

import { HOST }                 from '../../../utils/config'
import { formStyle }            from '../../../styles/formStylesheet'
import { ensureSession } from '../../../services/handleSession'

export default function TaskForm() {
    const [loading, setLoading]       = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate]     = useState(new Date());
    const [pickerMode, setPickerMode] = useState('date');
    const [users, setUsers]           = useState([]);
    const [userOpen, setUserOpen]     = useState(false);
    const [areas, setAreas]           = useState([]);
    const [areaOpen, setAreaOpen]     = useState(false);
    const {control, handleSubmit, reset, formState: {errors} } = useForm();

    const router = useRouter()

    const getUsers = async () => {
        const sessionToken = await ensureSession()

        try {
            const response = await fetch(`${HOST}/users`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${sessionToken}`,
                }
            });

            if(response.status == 200){
                const json = await response.json();
                if(json.data.length <= 0){
                    setUsers([{label: "Todos", value: 0}])
                }else{
                    setUsers([{label:"Todos", value:0}, ...json.data.map(item => ({
                        label: item.name,
                        value: item.id
                    }))]);
                }
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
            console.error("TODO: Unable to fetch users:", err);
        }
    };

    const getAreas = async () => {
        const sessionToken = await ensureSession()

        try {
            const response = await fetch(`${HOST}/areas`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${sessionToken}`,
                }
            });

            if(response.status == 200){
                const json = await response.json();
                if(json.data.length <= 0){
                    setAreas([{label: "Todos", value: 0}])
                }else{
                    setAreas(json.data.map(item => ({
                        label: item.name,
                        value: item.id
                    })));
                }
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
            console.error("TODO: Unable to fetch areas:", err);
        }
    };

    useEffect(() => {
        getUsers();
        getAreas();
    }, []);

    const postTask = async (data) => {
        const sessionToken = await ensureSession()

        setLoading(true)
        try{
            const response = await fetch(`${HOST}/createTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${sessionToken}`,
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

    const openPicker = () => {
        setTempDate(new Date());
        setPickerMode('date');
        setShowPicker(true);
    };

    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <SafeAreaView style={{ flex: 1 }}>
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

                            <View>
                                <Text>Prazo:</Text>
                                <Controller
                                    control={control}
                                    name="deadline"
                                    defaultValue={null}
                                    rules={{ required: "Prazo é obrigatório" }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Button
                                                title={value ? value.toLocaleString() : "Selecionar"}
                                                onPress={openPicker}
                                            />

                                            {showPicker && (
                                                <DateTimePicker
                                                    value={tempDate}
                                                    mode={pickerMode}
                                                    is24Hour={true}
                                                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                                    onChange={(event, selectedDate) => {
                                                        if (!selectedDate) {
                                                            // usuário cancelou
                                                            setShowPicker(false);
                                                            return;
                                                        }

                                                        setTempDate(selectedDate);

                                                        if (Platform.OS === 'android') {
                                                            if (pickerMode === 'date') {
                                                                // depois de selecionar a data, abre o picker de hora
                                                                setPickerMode('time');
                                                            } else {
                                                                // depois de selecionar a hora, salva e fecha
                                                                onChange(selectedDate);
                                                                setShowPicker(false);
                                                            }
                                                        } else {
                                                            // iOS: mantém o valor temporário até o usuário clicar em "Confirmar"
                                                        }
                                                    }}
                                                />
                                            )}

                                            {Platform.OS === 'ios' && showPicker && (
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                                    <Button title="Cancelar" onPress={() => setShowPicker(false)} />
                                                    <Button title="Confirmar" onPress={() => {
                                                        onChange(tempDate);
                                                        setShowPicker(false);
                                                    }} />
                                                </View>
                                            )}

                                            {errors.deadline && <Text style={{ color: 'red' }}>{errors.deadline.message}</Text>}
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
        </SafeAreaProvider>
    );
}
