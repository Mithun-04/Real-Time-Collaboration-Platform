import Task from "../models/Task.js";
import User from "../models/User.js";
import Project from "../models/Project.js"; // Import Project model
import mongoose, { get } from "mongoose";

// ✅ Create Task (Manager Only)
const createTask = async ({ title, description, projectId, assignedTo, priority, dueDate, createdBy }) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new Error("Project not found");
    }

    if (project.manager.toString() !== createdBy.toString()) {
        throw new Error("Unauthorized: Only the project manager can create tasks");
    }

    // Check if assigned user exists
    const user = await User.findById(assignedTo);
    if (!user) {
        throw new Error("Assigned user not found");
    }


    // Create and save the task
    const task = new Task({
        title,
        description,
        projectId,
        assignedTo,
        priority,
        dueDate,
        createdBy,
    });

    return await task.save();
};


const getProjectTasks = async (projectId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
    }

    return await Task.find({ projectId, assignedTo: userId })
        .populate("assignedTo", "name email");
};


const getAllTasks = async (projectId) => {

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project Id");
    }
    return await Task.find({ projectId })
        .populate("assignedTo", "name email");

}

const getUserTasks = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
    }

    return await Task.find({ assignedTo: userId })
        .populate("assignedTo", "name email");
};

const updateTask = async (taskId, userId, updateData) => {

    console.log(taskId);
    const task = await Task.findById(taskId);
    if (!task) {
        throw new Error("Task not found");
    }

    if (task.assignedTo?.toString() !== userId) {
        throw new Error("Access denied: You are not assigned to this task");
    }


    if (updateData.status) {
        const validStatuses = ["to-do", "doing", "done"];
        if (!validStatuses.includes(updateData.status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
        }
    }

    task.status = updateData.status;
    const updatedTask = await task.save();

    return updatedTask;
};

// ✅ Delete Task (Manager Only)
const deleteTask = async (taskId, userId, userRole) => {

    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    // Only the manager can delete tasks
    if (userRole !== "manager") {
        throw new Error("Access denied: Only the manager can delete tasks");
    }

    return await Task.findByIdAndDelete(taskId);
};

// ✅ Export All Functions
export default {
    createTask,
    getProjectTasks,
    getUserTasks,
    updateTask,
    deleteTask,
    getAllTasks
};
