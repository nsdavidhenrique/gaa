import React, { useState, useEffect, useContext } from 'react'
import { View, ScrollView, Text } from 'react-native'

import { taskStyle }    from '../styles/taskStylesheet';
import { TaskRenderStatus } from './taskRenderStatus'
import { isLate } from '../utils/isLate'

export const TaskDetail = ({ task }) => {
    return(
        <>
            <ScrollView style={taskStyle.container}>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Área:</Text>
                    <Text style={taskStyle.detailContent}>{task.area}</Text>
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Responsável:</Text>
                    <Text style={taskStyle.detailContent}>{task.target ? task.target: 'Todos'}</Text>
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Descrição:</Text>
                    <Text style={taskStyle.detailContent}>{task.description}</Text>
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Status: </Text>
                    <View style={taskStyle.detailStatusContainer}>
                        <TaskRenderStatus status={task.status} />
                        {task.status == "Em Andamento" ? <Text style={taskStyle.detailHeader}> Por: {task.beingDoneBy}</Text> : ""}
                        {task.status == "Finalizado" ? <Text style={taskStyle.detailHeader}> Por: {task.doneBy}</Text> : ""}
                    </View>
                    {task.status != "Pendente" ?   <Text style={taskStyle.detailHeader}> Iniciado em: {task.beingDoneAt}</Text> : ""}
                    {task.status == "Finalizado" ? <Text style={taskStyle.detailHeader}> Finalizado em: {task.doneAt}</Text> : ""}
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Criado por: {task.createdBy}</Text>
                    <Text style={taskStyle.detailHeader}>Em: {(new Date(task.createdAt)).toLocaleString("pt-BR")}</Text>
                    <Text style={taskStyle.detailHeader}>
                        Prazo: {(new Date(task.deadline)).toLocaleString("pt-BR")}
                        {isLate(task.deadline) && <Text style={taskStyle.detailLate}> Atrasado!</Text>}
                    </Text>
                </View>
                <View style={taskStyle.detailField}>
                    <Text style={taskStyle.detailHeader}>Comentários:</Text>
                    <Text>TODO!!!</Text>
                </View>
            </ScrollView>
        </>
    )
}

