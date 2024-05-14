import { nanoid } from "nanoid";
import { getDbCollection } from "../../server/mongo-server.js";
import { validatePayload } from '../../utils/validatePayload/index.js';

const createTask = async (req, res) => {
    try {
        const { userId, body, requestTime } = req;
        const { taskCollection } = await getDbCollection();

        const payload = { ...body};
        validatePayload(payload);

        const taskId = nanoid();
        const taskPayload = {
            id: taskId,
            userId,
            created_date: requestTime,
            last_modified_date: requestTime,
            ...payload,
        }

        let createdTask = await taskCollection.insertOne(taskPayload);
        createdTask = await taskCollection.findOne({ id: taskId });
        
        console.log(`Create new task by user: ${userId} with taskId: ${taskId}`);
        res.status(201).json(createdTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send('Internal Server Error');
    }
}

const getTasksList = async (req, res) => {
    try {
        const { userId } = req;

        const { taskCollection } = await getDbCollection();
        const tasks = await taskCollection.find({ userId }).toArray();

        res.send(tasks).status(200);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
}

const getTask = async (req, res) => {
    try {
        const { params, userId } = req;
        const { id: taskId } = params;

        const { taskCollection } = await getDbCollection();
        const tasks = await taskCollection.find({ userId, id: taskId }).toArray();

        res.send(tasks).status(200);
    } catch (error) {
        console.error(`Error fetching tasks with id: ${taskId}`, error);
        res.status(500).send('Internal Server Error');
    }
}

const deleteTask = async (req, res) => {
    const { params, userId } = req;
    const { id: taskId } = params;

    try {
        const { taskCollection } = await getDbCollection();
        const result = await taskCollection.deleteOne({ userId, id: taskId });

        if (result.deletedCount === 0) {
            res.status(404).send(`Task with id ${taskId} not found.`);
            return;
        }

        res.status(200).send('Task deleted successfully');
    } catch (error) {
        console.error(`Error deleting task with id: ${taskId}`, error);
        res.status(500).send('Internal Server Error');
    }
}

const updateTask = async (req, res) => {
    const { params, userId, body, requestTime } = req;
    const { id: taskId } = params;

    try {
        const { taskCollection } = await getDbCollection();
        validatePayload(body);
        const updatePayload = {
            ...body,
            last_modified_date: requestTime,
        }
        const result = await taskCollection.updateOne({ userId, id: taskId }, { $set: updatePayload });

        if (result.matchedCount === 0) {
            res.status(404).send(`Task with id ${taskId} not found.`);
            return;
        }

        const updatedTask = await taskCollection.findOne({ id: taskId });

        res.status(200).send(updatedTask);
    } catch (error) {
        console.error(`Error updating task with id: ${taskId}`, error);
        res.status(500).send('Internal Server Error');
    }
}

export { getTasksList, getTask, createTask, deleteTask, updateTask };