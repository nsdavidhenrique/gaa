import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, ScrollView, Button } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { TaskProvider } from '../../context/taskContext';
import TaskList         from '../../components/taskList'

export default function Task() {
    const router = useRouter();
    //TODO <Suspense fallback>

    return (
        <>
            <Stack.Screen options={{ headerShown: false }}/>
            <StatusBar style="auto" />
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{ flexGrow: 1 }}>
                    <TaskProvider>
                        <TaskList />
                    </TaskProvider>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
