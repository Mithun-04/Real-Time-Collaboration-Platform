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
        res.status(
            error.message === 'Project not found' || error.message === 'Unauthorized' || error.message.includes('Request body')
                ? 400
                : 500
        ).json({
            success: false,
            message: error.message || 'Failed to send invitations',
        });
    }
};

export default {
    createProject,
    getProjects,
    getProjectById,
    inviteMembers
};