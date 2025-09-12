import { Tab, Tabs } from "expo-router"

//export default function RootLayout() { return <Slot /> }

export default function TabLayout() {
    return(
        <Tabs screenOptions={{ tabBarShowLabel: true, headerShown: false }}>
            <Tabs.Screen name="tasks" options={{ title: "Tarefas" }} />
            <Tabs.Screen name="create" options={{ title: "Criar" }} />
            <Tabs.Screen name="settings" options={{ title: "Configuração" }} />
        </Tabs>
    );
}
