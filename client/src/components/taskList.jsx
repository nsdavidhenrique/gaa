import React, { useContext, useEffect } from 'react';
import { TaskContext } from '../context/taskContext'
import { TaskListItem } from './taskListItem'

export default function TaskList(){
    const { tasks, loadPendingTasks } = useContext(TaskContext) //, addTask, removeTask

    useEffect(() => {
        loadPendingTasks()
    }, [])
    
    return(
        <>
            {tasks.map(task => ( <TaskListItem task={task} key={task.id}/> ))}
        </>
    );
};
