import { Text } from 'react-native';
import { taskStyle } from '../styles/taskStylesheet';

export const TaskRenderStatus = ({statusId, status}) => {
    if(statusId == 3 || status == "Finalizado"){
        return <Text style={taskStyle.statusDone}>FINALIZADO</Text>
    } else if(statusId == 2 || status == "Em Andamento"){
        return <Text style={taskStyle.statusInProgress}>EM ANDAMENTO</Text>
    } else{
        return <Text style={taskStyle.statusPending}>PENDENTE</Text>
    }
}
