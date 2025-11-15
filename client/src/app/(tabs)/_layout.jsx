import { Tab, Tabs } from "expo-router"
import { Ionicons }  from "@expo/vector-icons";
import { useTheme }  from "../../hooks/useTheme";

export default function TabLayout() {
    const theme = useTheme();

    return(
        <Tabs
            screenOptions={{
                tabBarShowLabel: true,
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary
            }}
        >

            <Tabs.Screen
                name="tasks"
                options={{
                    title: "Tarefas",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="create"
                options={{
                    title: "Criar",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="add-circle-outline" size={size} color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Configuração",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
