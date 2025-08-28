import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, View, Text, TextInput, Switch, StyleSheet, Button, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'

import DropDownPicker from 'react-native-dropdown-picker';
import { useForm } from 'react-hook-form'

import { HOST } from '../../utils/config'
import { formStyle } from '../../styles/formStylesheet'

// TODO deadline and validation
export default function TaskForm() {
    const { register, setValue, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState([]);
    const [userOpen, setUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [areas, setAreas] = useState([]);
    const [areaOpen, setAreaOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);

    const [urgent, setUrgent] = useState(false);

    const getUsers = async () => {
        try {
            const response = await fetch(`${HOST}/users`);
            const data = await response.json();
            if (!data.error) {
                setUsers(data.map(item => ({
                    label: item.name,
                    value: item.id
                })));
            } else {
                console.error("Failed to fetch users: ", data.error);
            }
        } catch (err) {
            console.error("Unable to fetch users:", err);
        }
    };

    const getAreas = async () => {
        try {
            const response = await fetch(`${HOST}/areas`);
            const data = await response.json();
            if (!data.error) {
                setAreas(data.map(item => ({
                    label: item.name,
                    value: item.id
                })));
            } else {
                console.error("Failed to fetch areas: ", data.error);
            }
        } catch (err) {
            console.error("Unable to fetch areas:", err);
        }
    };

    const onSubmit = (data: any) => {
        console.log("Form data:", data);
        // Aqui: data.user e data.area vão ser apenas os IDs
    };

    useEffect(() => {
        getUsers();
        getAreas();
    }, []);

    useEffect(() => {
        register('user');
        register('area');
        register('description');
        register('urgent');
        register('deadline');
    }, [register]);

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
                                <DropDownPicker
                                    open={userOpen}
                                    value={selectedUser}
                                    items={users}
                                    setOpen={setUserOpen}
                                    setValue={callback => {
                                        const value = callback(selectedUser);
                                        setSelectedUser(value);
                                        setValue('user', value);
                                    }}
                                    setItems={setUsers}
                                    placeholder="Selecione um responsável"
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                    flatListProps={{nestedScrollEnabled:true}}
                                    style={formStyle.dropDown}
                                />
                            </View>

                            <View style={formStyle.container}>
                                <Text style={formStyle.label}>Área</Text>
                                <DropDownPicker
                                    open={areaOpen}
                                    value={selectedArea}
                                    items={areas}
                                    setOpen={setAreaOpen}
                                    setValue={callback => {
                                        const value = callback(selectedArea);
                                        setSelectedArea(value);
                                        setValue('area', value);
                                    }}
                                    setItems={setAreas}
                                    placeholder="Selecione uma área"
                                    zIndex={2000}
                                    zIndexInverse={2000}
                                    flatListProps={{nestedScrollEnabled:true}}
                                    style={formStyle.dropDown}
                                />
                            </View>

                            <View style={formStyle.container}>
                                <Text style={formStyle.label}>Descrição</Text>
                                <TextInput
                                    onChangeText={text => setValue('description', text)}
                                    placeholder="Digite a descrição"
                                    style={formStyle.textInput}
                                    multiline={true}
                                    numberOfLines={6}
                                />
                            </View>

                            <View style={formStyle.container}>
                                <Text>Urgente</Text>
                                <Switch
                                    value={urgent}
                                    onValueChange={val => {
                                        setUrgent(val)
                                        setValue('urgent', val)
                                    }}
                                />
                            </View>

                            <Button title="Criar" onPress={handleSubmit(onSubmit)} />
                        </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
