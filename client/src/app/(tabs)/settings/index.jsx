import { Alert, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Api } from '../../../services/api';
import { logout } from '../../../services/handleSession';
import { useTheme } from '../../../hooks/useTheme';
import { commonStyles } from '../../../styles/commonStyles';

export default function Settings() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const theme = useTheme();
    const styles = commonStyles(theme);

    const newUser = async (name) => {
        if (!name) return Alert.alert("Informe o nome do usuário");
        const response = await Api.createUser(name, router);
        if (!response.ok) {
            if (response.status === 409) Alert.alert("Usuário já existe");
            return;
        }
        Alert.alert("Usuário criado com sucesso");
    };

    const resetPassword = async (name) => {
        if (!name) return Alert.alert("Informe o nome do usuário");
        const response = await Api.resetPassword(name, router);
        if (!response.ok) {
            if (response.status === 404) Alert.alert("Usuário não encontrado");
            return;
        }
        Alert.alert(`Senha do usuário ${name} resetada com sucesso.`);
    };

    const promptInput = (title, callback) => {
        Alert.prompt(
            title,
            "",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Confirmar", onPress: async (text) => await callback(text) }
            ]
        );
    };

    const MenuItem = ({ label, onPress, danger }) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.6}
            style={{
                backgroundColor: theme.colors.card,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                marginBottom: 6,
                borderWidth: 1,
                borderColor: theme.colors.borderColor,
            }}
        >
            <Text style={{
                fontSize: 14,
                fontWeight: "500",
                color: theme.colors.textPrimary,
            }}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <MenuItem
                    label="Criar Usuário"
                    onPress={() => promptInput("Novo usuário", newUser)}
                />
                <MenuItem
                    label="Resetar Senha"
                    onPress={() => promptInput("Resetar senha", resetPassword)}
                />
                <MenuItem
                    label="Sair"
                    onPress={() => logout(router)}
                />
            </ScrollView>
        </ScreenWrapper>
    );
}
