import {
    Alert,
    Modal,
    View,
    Text,
    TextInput,
    ScrollView,
    Switch,
    StyleSheet,
    Platform
} from 'react-native';

import DropDownPicker       from 'react-native-dropdown-picker';
import DateTimePickerModal  from '@react-native-community/datetimepicker'
import DateTimePicker       from '@react-native-community/datetimepicker'
import { ScreenWrapper }    from '../../../components/ScreenWrapper'
import { CustomButton }     from '../../../components/CustomButton'

import React, { useState, useEffect } from 'react';
import { useForm, Controller }        from 'react-hook-form'
import { useRouter }                  from 'expo-router'
import { useFocusEffect }             from '@react-navigation/native';
import { useTheme }                   from '../../../hooks/useTheme'     

import { commonStyles } from '../../../styles/commonStyles'

import { Api } from '../../../services/api'

export default function TaskForm() {
    const theme = useTheme();
    const styles = commonStyles(theme);
    const router = useRouter();

    const [loading, setLoading]       = useState(false);

    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate]     = useState(new Date());
    const [pickerMode, setPickerMode] = useState('date');

    const [users, setUsers]           = useState([]);
    const [areas, setAreas]           = useState([]);
    const [userOpen, setUserOpen]     = useState(false);
    const [areaOpen, setAreaOpen]     = useState(false);

    const {control, handleSubmit, reset, formState: {errors} } = useForm();

    const getUsers = async () => {
        setLoading(true)

        const response  = await Api.getUsers(router)
        if(!response.ok){
            setLoading(false)
            return
        }

        const body = await response.json()
        if(body.data.length <= 0)
            setUsers([{label: "Todos", value: 0}])
        else
            setUsers([{label: "Todos", value: 0}, ...body.data.map(item => ({ label: item.name, value: item.id }))]);

        setLoading(false)
    };

    const getAreas = async () => {
        setLoading(true)

        const response = await Api.getAreas(router)
        if(!response.ok){
            setLoading(false)
            return
        }

        const body = await response.json()
        if(body.data.length <= 0)
            setAreas([{label: "Todos", value: 0}])
        else
            setAreas(body.data.map(item => ({ label: item.name, value: item.id })));

        setLoading(false)
    };

    useFocusEffect(
        React.useCallback(() => {
            getUsers();
            getAreas();
        }, [])
    );

    useEffect(() => {
        getUsers();
        getAreas();
    }, []);

    const postTask = async (data) => {
        setLoading(true)

        const response = await Api.createTask(data, router)
        if(!response.ok){
            setLoading(false)
            return
        }

        reset()
        router.navigate("tasks")
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

    const openPicker = (currentValue, setTempDate, setPickerMode, setShowPicker) => {
        setTempDate(currentValue ?? new Date());
        if (Platform.OS === 'android') {
            setPickerMode('date');
            setShowPicker(true);
        } else {
            setPickerMode('datetime');
            setShowPicker(true);
        }
    };

  return (
        <ScreenWrapper>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, gap: 16 }}
            >
                <View style={{ zIndex: 5000 }}>
                    <Text style={styles.labelText}>Responsável</Text>
                    {errors.targetId && <Text style={{ color: theme.colors.error }}>{errors.targetId.message}</Text>}
                    <Controller
                        control={control}
                        name="targetId"
                        defaultValue={null}
                        rules={{ required: "Responsável é obrigatório" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <DropDownPicker
                                value={value}
                                onSelectItem={(item) => onChange(item.value)}
                                onBlur={onBlur}
                                items={users}
                                open={userOpen}
                                setOpen={setUserOpen}
                                disabled={loading}
                                placeholder="Selecione um responsável"
                                style={[styles.input]}
                                listMode="SCROLLVIEW"
                            />
                        )}
                    />
                </View>

                <View style={{ zIndex: 4000 }}>
                    <Text style={styles.labelText}>Área</Text>
                    {errors.areaId && <Text style={{ color: theme.colors.error }}>{errors.areaId.message}</Text>}
                    <Controller
                        control={control}
                        name="areaId"
                        defaultValue={null}
                        rules={{ required: "Área é obrigatória" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <DropDownPicker
                                value={value}
                                onSelectItem={(item) => onChange(item.value)}
                                onBlur={onBlur}
                                items={areas}
                                open={areaOpen}
                                setOpen={setAreaOpen}
                                disabled={loading}
                                placeholder="Selecione uma área"
                                style={[styles.input]}
                                listMode="SCROLLVIEW"
                            />
                        )}
                    />
                </View>

                <View>
                    <Text style={styles.labelText}>Prazo</Text>
                    <Controller
                        control={control}
                        name="deadline"
                        defaultValue={null}
                        rules={{ required: "Prazo é obrigatório" }}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <CustomButton
                                    title={value ? new Date(value).toLocaleString() : "Selecionar data e hora"}
                                    onPress={() => openPicker(value, setTempDate, setPickerMode, setShowPicker)}
                                />

                                {showPicker && (
                                    <DateTimePicker
                                        key={pickerMode}
                                        value={tempDate}
                                        mode={pickerMode}
                                        is24Hour={true}
                                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                        onChange={(event, selected) => {
                                            if (Platform.OS === 'android') {
                                                if (event?.type === 'dismissed') {
                                                    setShowPicker(false);
                                                    return;
                                                }

                                                if (pickerMode === 'date') {
                                                    const chosenDate = selected || tempDate;
                                                    setTempDate(chosenDate);
                                                    setPickerMode('time');
                                                    setShowPicker(true);
                                                } else {
                                                    const chosenTime = selected || tempDate;
                                                    const finalDate = new Date(tempDate);
                                                    finalDate.setHours(chosenTime.getHours(), chosenTime.getMinutes(), 0, 0);
                                                    onChange(finalDate);
                                                    setShowPicker(false);
                                                }
                                                return;
                                            }
                                            if (selected) setTempDate(selected);
                                        }}
                                    />
                                )}

                                {Platform.OS === 'ios' && showPicker && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <CustomButton title="Cancelar" onPress={() => setShowPicker(false)} />
                                        <CustomButton title="Confirmar" onPress={() => { onChange(tempDate); setShowPicker(false); }} />
                                    </View>
                                )}

                                {errors.deadline && <Text style={{ color: theme.colors.error }}>{errors.deadline.message}</Text>}
                            </>
                        )}
                    />
                </View>

                <View>
                    <Text style={styles.labelText}>Descrição</Text>
                    {errors.description && <Text style={{ color: theme.colors.error }}>{errors.description.message}</Text>}
                    <Controller
                        control={control}
                        name="description"
                        rules={{ required: "Descrição é obrigatória" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                                placeholder="Digite a descrição"
                                editable={!loading}
                                style={[styles.input, { textAlign: 'left', height: 120 }]}
                                multiline={true}
                            />
                        )}
                    />
                </View>

                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text style={styles.labelText}>Urgente</Text>
                    <Controller
                        control={control}
                        name="urgent"
                        defaultValue={false}
                        render={({ field: { onChange, value } }) => (
                            <Switch value={value} onValueChange={onChange} />
                        )}
                    />
                </View>

                <CustomButton title="Criar" onPress={handleSubmit(onSubmit)} disabled={loading} style={{ marginTop: 10 }}/>
            </ScrollView>
        </ScreenWrapper>
    );
}
