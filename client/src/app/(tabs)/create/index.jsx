import {
    Alert,
    Modal,
    View,
    Text,
    TextInput,
    Switch,
    StyleSheet,
    Platform
} from 'react-native';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form'
import { useRouter }           from 'expo-router'

import DropDownPicker          from 'react-native-dropdown-picker';
import DateTimePickerModal     from '@react-native-community/datetimepicker'
import DateTimePicker          from '@react-native-community/datetimepicker'

import { ScreenWrapper } from '../../../components/ScreenWrapper'
import { CustomButton }  from '../../../components/CustomButton'

import { HOST }                 from '../../../utils/config'
import { ensureSession, handleSessionExpired } from '../../../services/handleSession'

export default function TaskForm() {
    const [loading, setLoading]       = useState(false);

    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate]     = useState(new Date());
    const [pickerMode, setPickerMode] = useState('date');

    const [users, setUsers]           = useState([]);
    const [areas, setAreas]           = useState([]);
    const [userOpen, setUserOpen]     = useState(false);
    const [areaOpen, setAreaOpen]     = useState(false);

    const {control, handleSubmit, reset, formState: {errors} } = useForm();

    const router = useRouter()

    const getUsers = async () => {
        setLoading(true)

        const sessionToken = await ensureSession()
        const response     = await fetch(
            `${HOST}/users`,
            {
                method: 'GET',
                headers: { "Authorization": `Bearer ${sessionToken}` }
            }
        )

        if(!response.ok){
            if(response.status == 401 || response.status == 422) handleSessionExpired(router)
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 500) Alert.alert("Internal Server Error")
        } else{
            const json = await response.json();

            if(json.data.length <= 0) setUsers([{label: "Todos", value: 0}])
            else                      setUsers([{label: "Todos", value: 0}, ...json.data.map(item => ({ label: item.name, value: item.id }))]);
        }

        setLoading(false)
    };

    const getAreas = async () => {
        setLoading(true)

        const sessionToken = await ensureSession()
        const response     = await fetch(
            `${HOST}/areas`,
            {
                method: 'GET',
                headers: { "Authorization": `Bearer ${sessionToken}` }
            }
        );

        if(!response.ok){
            if(response.status == 401 || response.status == 422) handleSessionExpired(router)
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 500) Alert.alert("Internal Server Error")
            return
        } else{
            const json = await response.json();

            if(json.data.length <= 0) setAreas([{label: "Todos", value: 0}])
            else                      setAreas(json.data.map(item => ({ label: item.name, value: item.id })));
        }

        setLoading(false)
    };

    useEffect(() => {
        getUsers();
        getAreas();
    }, []);

    const postTask = async (data) => {
        setLoading(true)

        const sessionToken = await ensureSession()
        const response     = await fetch(
            `${HOST}/createTask`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${sessionToken}`,
                },
                body: JSON.stringify(data)
            }
        )

        if(!response.ok){
            if(response.status == 401 || response.status == 422) handleSessionExpired(router)
            if(response.status == 400) Alert.alert("Bad request")
            if(response.status == 500) Alert.alert("Internal Server Error")
        } else{
            reset()
        }

        setLoading(false)
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
        <ScreenWrapper>
            <View style={{zIndex: 3000}}>
                <View>
                    <Text>Responsável</Text>
                    {errors.target && <Text style={{ color: 'red' }}>{errors.target.message}</Text>}
                    <Controller
                        control={control}
                        name="targetId"
                        defaultValue={null}
                        rules={{required: "Responsável é obrigatório"}}
                        render={({field: {onChange, onBlur, value}}) => (
                            <DropDownPicker
                                value={value}
                                onChangeValue={onChange}
                                onBlur={onBlur}
                                items={users}
                                open={userOpen}
                                setOpen={setUserOpen}
                                disabled={loading}
                                placeholder="Selecione um responsável"
                                style={formStyle.dropDown}
                            />
                        )}
                    />
                </View>

                <View style={{zIndex: 2000}}>
                    <Text>Área</Text>
                    {errors.area && <Text style={{color: 'red'}}>{errors.area.message}</Text>}
                    <Controller
                        control={control}
                        name="areaId"
                        defaultValue={null}
                        rules={{required: "Area é obrigatório"}}
                        render={({field: {onChange, onBlur, value}}) => (
                            <DropDownPicker
                                value={value}
                                onChangeValue={onChange}
                                onBlur={onBlur}
                                items={areas}
                                open={areaOpen}
                                setOpen={setAreaOpen}
                                disabled={loading}
                                placeholder="Selecione uma área"
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
                                <CustomButton title={value ? value.toLocaleString() : "Selecionar"} onPress={openPicker} />
                                {showPicker && (
                                    <DateTimePicker
                                        value={tempDate}
                                        mode={pickerMode}
                                        is24Hour={true}
                                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                        onChange={(event, selectedDate) => {
                                            if (!selectedDate) {
                                                setShowPicker(false);
                                                return;
                                            }
                                            setTempDate(selectedDate);
                                            if (Platform.OS === 'android') {
                                                if (pickerMode === 'date') setPickerMode('time');
                                                else {
                                                    onChange(selectedDate);
                                                    setShowPicker(false);
                                                }
                                            }
                                        }}
                                    />
                                )}

                                {Platform.OS === 'ios' && showPicker && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <CustomButton title="Cancelar" onPress={() => setShowPicker(false)} />
                                        <CustomButton title="Confirmar" onPress={() => {
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

                <View>
                    <Text>Descrição</Text>
                    {errors.description && <Text style={{color: 'red'}}>{errors.description.message}</Text>}
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
                <View>
                    <Text>Urgente</Text>
                    <Controller
                        control={control}
                        name="urgent"
                        defaultValue={false}
                        render={({field: {onChange, onBlur, value}}) => (
                            <Switch value={value} onValueChange={onChange} />
                        )}
                    />
                </View>
                <CustomButton title="Criar" onPress={handleSubmit(onSubmit)} disabled={loading} />
            </View>
        </ScreenWrapper>
    );
}

const formStyle = StyleSheet.create({
    textInput: {
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 10,
        padding: 5,
        height: 150
    },
    dropDown: {
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 10
    },
})
