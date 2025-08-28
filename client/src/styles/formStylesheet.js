import { StyleSheet } from "react-native"

const formStyle = StyleSheet.create({
    form: {
        backgroundColor: '#FFF',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    container: {
        marginBottom: 25,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 10,
        padding: 5,
        height: 150
    },
    dropDown: {
        width: 250
    },
})

export { formStyle };
