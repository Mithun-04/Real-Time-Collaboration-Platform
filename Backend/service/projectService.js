import User from "../models/User.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";

const createProject = async ({ name, description, managerId }) => {

    const user = await User.findById(managerId);

    if (!user) {

        throw {message : 'User not Found'};
    }
    const existingProject = await Project.findOne({ name });

    if (existingProject) {
        throw {message : 'Project with this name already exists'};
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
    console.log('Fetching projects for userId:', userId); // Log the userId

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
        if (!invitation.name || !invitation.role) {
            throw new Error('Each invitation must have a username and role');
        }
        if (!validRoles.includes(invitation.role)) {
            throw new Error(`Invalid role: ${invitation.role}. Must be one of ${validRoles}`);
        }

        // Find user by username
        const user = await User.findOne({ name: invitation.name });
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
export default {
    createProject,
    getProjects,
    getProjectDetails,
    inviteMembersToProject
}