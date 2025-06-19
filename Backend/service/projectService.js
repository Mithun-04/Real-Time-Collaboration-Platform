import User from "../models/User.js";
import Project from "../models/Project.js";
import Invitation from "../models/Invitation.js";
import Message from "../models/Message.js";

import mongoose from "mongoose";
import { memo } from "react";

const createProject = async ({ name, description, managerId }) => {

    const user = await User.findById(managerId);

    if (!user) {

        throw { message: 'User not Found' };
    }
    const existingProject = await Project.findOne({ name });

    if (existingProject) {
        throw { message: 'Project with this name already exists' };
    }

    const project = new Project({
        name,
        description,
        manager: managerId,
        members: [{ userId: managerId, role: "manager" }]
    })

    const savedProject = await project.save();

    await User.updateOne({ _id: managerId }, {
        $push: {
            projects: {
                projectId: savedProject._id,
                role: 'manager'
            }
        }
    })

    return savedProject;

}

const getProjects = async (userId) => {

    const projects = await Project.find({
        $or: [
            { manager: userId },
            { 'members.userId': userId }
        ],
    }).select('_id name description manager').lean();

    const transformedProjects = projects.map(project => ({
        _id: project._id,
        description: project.description,
        name: project.name,
        isManager: project.manager.toString() === userId.toString()
    }));

    if (!projects || projects.length === 0) {
        console.log('No projects found for user:', userId);
    }

    return transformedProjects;
};


const getProjectDetails = async (projectId, userId) => {
    const project = await Project.findById(projectId)
        .populate('manager', 'name email')
        .populate('members.userId', 'name email');

    if (!project) {
        throw new Error('Project not found');
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isManager = project.manager._id.toString() === userObjectId.toString();
    const isMember = project.members.some(member =>
        member.userId._id.toString() === userObjectId.toString()
    );

    if (!isManager && !isMember) {
        throw new Error('Unauthorized');
    }

    const projectDetails = {
        _id: project._id,
        name: project.name,
        manager: project.manager,
        members: project.members,
        isManager: isManager,
        isMember: isMember,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };

    return projectDetails;
};
const inviteMembersToProject = async (projectId, managerId, invitations) => {
    const projectObjectId = new mongoose.Types.ObjectId(projectId);
    const managerObjectId = new mongoose.Types.ObjectId(managerId);

    // Fetch the project
    const project = await Project.findById(projectObjectId);
    // console.log('Project:', project); // Log the project for debugging
    if (!project) {
        throw new Error('Project not found');
    }

    // Check if the user is the manager
    if (project.manager.toString() !== managerObjectId.toString()) {
        throw new Error('Unauthorized: Only the project manager can invite members');
    }

    // Validate and create invitations
    const validRoles = ['member', 'manager'];
    const invitationDocs = [];

    for (const invitation of invitations) {

        if (!invitation.role) {
            invitation.role = 'member'; // Default to 'member' if no role is provided
        }

        // Find user by username
        const user = await User.findOne({ name: invitation.name });
        console.log('User found:', user); // Log the user for debugging
        if (!user) {
            throw new Error(`User with username ${invitation.username} not found`);
        }

        const userId = user._id; // Get the ObjectId from the user document

        const existingInvitation = await Invitation.findOne({
            projectId: projectObjectId,
            userId: userId,
            status: 'pending',
        });
        const isAlreadyMember = project.members.some(m => m.userId.toString() === userId.toString());

        if (existingInvitation) {
            throw { status: 400, message: `User with username ${invitation.name} already has a pending invitation for this project` };
        }

        if (isAlreadyMember) {
            throw { status: 400, message: `User with username ${invitation.name} is already a member of this project` };
        }

        if (!existingInvitation && !isAlreadyMember) {
            invitationDocs.push({
                projectId: projectObjectId,
                userId: userId, // Store userId in the invitation
                role: invitation.role,
            });
        }
    }

    if (invitationDocs.length > 0) {
        await Invitation.insertMany(invitationDocs);
    }

    return;
};

const getProjectMembers = async (projectId) => {

    try {
        const project = await Project.findById(projectId).populate('members.userId', 'name email');
        if (!project) {
            throw { status: 400, meassage: 'Project not found' };
        }
        return project.members.map(member => ({
            userId: member.userId._id,
            name: member.userId.name,
            email: member.userId.email,
            role: member.role
        }));
    }
    catch (error) {
        throw { status: error.status || 500, message: 'Failed to retrieve project members' };
    }
};


const addMessageToProject = async (projectId, senderId, content) => {
    try {
        const project = await Project.findById(projectId);
        console.log(project);

        if (!project) {
            throw { status: 404, message: 'Project not found' };
        }
        if (!project.members.some(member => member.userId.toString() === senderId)) {
            throw { status: 400, message: 'User is not a member of this project' };
        }

        const createdMsg = await Message.create({
            projectId: project._id,
            senderId: senderId,
            content: content
        });

        // Populate senderId with name and email
        const res = await Message.findById(createdMsg._id).populate('senderId', 'name email');
        return res;
    }
    catch (error) {
        throw { status: error.status || 500, message: error.message || 'Failed to add message to project' };
    }
};


const getMessages = async (projectId) => {
    try {
        const exsist = await Project.findById(projectId);
        if (!exsist) {
            throw { status: 404, message: "No Project is Found" };
        }
        const messages = await Message.find({ projectId }).populate('senderId', 'name email').sort({ createdAt: 1 }).lean();
        return messages;
    }
    catch (error) {
        res.status(500).json({
            status: false,
            meassage: error.message || "Error in fetching the Messages"
        })
    }
}


export default {
    createProject,
    getProjects,
    getProjectDetails,
    inviteMembersToProject,
    getProjectMembers,
    addMessageToProject,
    getMessages
}