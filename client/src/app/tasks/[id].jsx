import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native';

import { TaskProvider } from '../../context/taskContext';
import TaskDetail       from '../../components/taskDetail';

export default function TaskDetailScreen() {
    return (
        <>
            <Stack.Screen options={{ title: ""}}/>
            <TaskProvider>
                <TaskDetail id={useLocalSearchParams()} />
            </TaskProvider>
        </>
    );
}
