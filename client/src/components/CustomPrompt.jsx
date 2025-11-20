import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native'

import { useState }     from 'react'
import { useTheme }     from '../hooks/useTheme'
import { commonStyles } from '../styles/commonStyles'

export function CustomPrompt({ visible, title, onCancel, onConfirm }) {
    const [text, setText] = useState('')
    const theme  = useTheme()
    const styles = commonStyles(theme)

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={{
                flex:1,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'rgba(0,0,0,0.5)'
            }}>
                <View style={{
                    width:'80%',
                    backgroundColor:theme.colors.background,
                    borderRadius:8,
                    padding:20,
                }}>
                    <Text style={[styles.titleText, {alignSelf: "center"}]}>{title}</Text>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        autoFocus
                        style={[styles.input, { marginVertical:12 }]}
                    />
                    <View style={{ flexDirection:'row', justifyContent:'flex-end' }}>
                        <TouchableOpacity
                            onPress={() => {
                                setText('')
                                onCancel()
                            }}
                        >
                            <Text style={[styles.labelText, { marginRight: 16 }]}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                onConfirm(text)
                                setText('')
                            }}
                        >
                            <Text style={styles.labelText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
