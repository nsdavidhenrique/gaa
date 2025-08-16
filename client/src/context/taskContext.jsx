import react, { useState, useEffect, createContext } from 'react'
// import tasksData from "../../assets/tasks.json";

const host = "http://localhost:8080"

export const TaskContext = createContext();

export const TaskProvider = ({children}) => {
    const [tasks, setTasks] = useState([]);

    const loadPendingTasks = async () => {
        try{
            const response = await fetch(`${host}/taskList?pending=true`);
            const data = await response.json();
            setTasks(data);
        } catch(err){
            //TODO
            console.error("Unable to fetch tasks:", err);
        }
    };

    const loadDoneTasks = async (offset) => {
        console.log('TODO!')
    }

    const getTaskDetails = async ({id}) => {
        let task
        try{
            const response = await fetch(`${host}/taskDetails?id=${id}`);
            const data = await response.json();
            task = data;
        } catch(err){
            //TODO
            console.error("Unable to fetch tasks:", err);
        } finally{
            return task
        }
    }

    const addTask = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    const removeTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    return (
        <TaskContext.Provider value={{ tasks, loadPendingTasks, getTaskDetails }}>
            {children}
        </TaskContext.Provider>
    );
}
