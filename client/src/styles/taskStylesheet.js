import { StyleSheet } from "react-native"

const taskStyle = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    listItem: {
        flex: 1,
        height: 110,
        backgroundColor: '#FFF',     
        marginBottom: 5,
        paddingLeft: 25,
        paddingRight: 25,
        justifyContent: 'center',
    },
    listItemDescription: {
        fontSize: 22,
    },
    listItemSubDescription:{
        fontSize: 18,
        color: '#808080'
    },
    listItemStatusContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    listUrgent: {
        color: "black",
        marginLeft: 10,
    },
    listLate: {
        color: "black",
        marginLeft: 10,
    },
    detailField: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    detailHeader: {
        color: 'grey',
        fontSize: 18,
    },
    detailContent: {
        paddingLeft: 10,
        paddingRight: 10,
        color: 'black',
        fontSize: 20,
    },
    detailUrgent: {
        color: "black",
        marginLeft: 10,
    },
    detailLate: {
        color: "red",
        marginLeft: 10,
    },
    detailStatusContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    statusDone:{
        color: 'green',
        backgroundColor: '#DFFFD6',
        borderRadius: 100,
        padding: 5,
    },
    statusInProgress:{
        color: 'orange',
        backgroundColor: '#FFE5B4',
        borderRadius: 100,
        padding: 5,
    },
    statusPending:{
        color: 'red',
        backgroundColor: '#FFB3B3',
        borderRadius: 100,
        padding: 5,
    },
});

export { taskStyle };
