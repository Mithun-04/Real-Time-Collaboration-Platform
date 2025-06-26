import { Component } from "react";
import projectService from "../service/projectService.js"


const createProject = async (req, res) => {

    try {
        const name = req.body.name;
        const description = req.body.description;
        const managerId = req.user.id;

        console.log(name, description, managerId);

        const newProject = await projectService.createProject({
            name,
            description,
            managerId
        })

        res.status(200).json({
            succes: true,
            data: newProject,
            message: "Project created Successfully"
        })
    }
    catch (error) {
        res.status(400).json({
            message: error.message || 'Failed to create project',
        });
    }
}

const getProjects = async (req, res) => {
    try {

        const userId = req.user.id;

        const projects = await projectService.getProjects(userId);

        res.status(200).json({
            success: true,
            data: projects,
            message: 'Projects retrieved successfully',
        })

    }
    catch (e) {
        res.status(500).json({
            succes: false,
            message: e.message || "Failed to Retrieve Projects"
        })
    }
}

const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.id;

        const project = await projectService.getProjectDetails(projectId, userId);

        console.log(project);

        res.status(200).json({
            success: true,
            data: project,
            message: 'Project details retrieved successfully',
        });
    } catch (error) {
        res.status(error.message === 'Project not found' || error.message === 'Unauthorized' ? 404 : 500).json({
            success: false,
            message: error.message || 'Failed to retrieve project details',
        });
    }
};

const inviteMembers = async (req, res) => {
    try {
        const projectId = req.params.id;
        const managerId = req.user.id;
        const invitations = req.body;

        if (!Array.isArray(invitations) || invitations.length === 0) {
            throw new Error('Request body must be a non-empty array of invitations');
        }
        await projectService.inviteMembersToProject(projectId, managerId, invitations);

        res.status(200).json({
            success: true,
            message: 'Invitations sent successfully',
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Failed to send invitations';
        res.status(status).json({
            success: false,
            message,
        });
    }
};

const getProjectMembers = async (req, res) => {
    try {
        // Accept projectId from req.body.projectId or req.query.projectId or req.params.id
        let projectId = req.params.id;
        if (!projectId) {
            throw new Error('Project ID is required');
        }
        const members = await projectService.getProjectMembers(projectId);
        res.status(200).json({
            success: true,
            data: members,
            message: 'Project members retrieved successfully',
        });
    } catch (error) {
        res.status(error.message === 'Project not found' || error.message === 'Unauthorized' ? 404 : 500).json({
            success: false,
            message: error.message || 'Failed to retrieve project members',
        });
    }
};

const searchProjectUsers = async (req, res) => {
    try {
        const { projectID } = req.body;
        const userId = req.user.id;
        if (!projectID) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required',
            });
        }
        const users = await projectService.searchProjectUsers(projectID, userId);
        res.status(200).json({
            success: true,
            data: users,
            message: 'Users retrieved successfully',
        });
    } catch (error) {
        res.status(error.message === 'Project not found' || error.message === 'Unauthorized' ? 404 : 500).json({
            success: false,
            message: error.message || 'Failed to retrieve users',
        });
    }
};

const addMessagetoProject = async (req, res) => {
    try {
        const { content } = req.body;
        const projectId = req.params.projectId;
        const senderId = req.user.id;

        console.log("projectId : ", projectId) 
        console.log("content : ", content) 

        if (!projectId || !content) {
            return res.status(400).json({
                success: false,
                message: 'Project ID and content are required',
            });
        }
        const message = await projectService.addMessageToProject(projectId, senderId, content);
        res.status(200).json({
            success: true,
            data: message,
            message: 'Message added to project successfully',
        });
    }
    catch (error) {
        res.status(error.message === 'Project not found' || error.message === 'Unauthorized' ? 404 : 500).json({
            success: false,
            message: error.message || 'Failed to add message to project',
        });
    }
};


const getMessages = async (req, res) => {

    try {
        const projectId = req.params.projectId;

        if (!projectId) {
            return res.status(400).json({
                status: false,
                message: "ProjectId is not Provided"
            })
        }

        const response = await projectService.getMessages(projectId);

        res.status(200).json({
            succes: true,
            messages: response
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve messages',
        });
    }
};

export default {
    createProject,
    getProjects,
    getProjectById,
    inviteMembers,
    getProjectMembers,
    addMessagetoProject,
    getMessages
};