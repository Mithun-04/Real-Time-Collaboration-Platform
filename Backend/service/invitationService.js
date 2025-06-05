import mongoose from 'mongoose';
import Invitation from '../models/Invitation.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const getUserInvitations = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const invitations = await Invitation.find({
    userId: userObjectId,
    status: 'pending',
  })
    .populate('projectId', 'name manager') // Populate project name and manager
    .populate({
      path: 'projectId.manager',
      select: 'name', // Only get the manager's name
      model: 'User'
    });
  return invitations;
};

const acceptInvitation = async (invitationId, userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const invitationObjectId = new mongoose.Types.ObjectId(invitationId);

  const invitation = await Invitation.findOne({ _id: invitationObjectId, status: 'pending' });
  if (!invitation) {
    throw new Error('Invalid or already processed invitation');
  }
  if (invitation.userId.toString() !== userObjectId.toString()) {
    throw new Error('Unauthorized: Invitation not intended for this user');
  }

  const project = await Project.findByIdAndUpdate(
    invitation.projectId,
    { $push: { members: { userId: invitation.userId, role: invitation.role } } },
    { new: true, runValidators: true }
  ).populate('manager', 'username email')
   .populate('members.userId', 'username email');

  if (!project) {
    throw new Error('Project not found');
  }

  await User.updateOne(
    { _id: invitation.userId },
    { $push: { projects: { projectId: invitation.projectId, role: invitation.role } } }
  );

  invitation.status = 'accepted';
  await invitation.save();

  return project;
};

const declineInvitation = async (invitationId, userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const invitationObjectId = new mongoose.Types.ObjectId(invitationId);

  const invitation = await Invitation.findOne({ _id: invitationObjectId, status: 'pending' });
  if (!invitation) {
    throw new Error('Invalid or already processed invitation');
  }
  if (invitation.userId.toString() !== userObjectId.toString()) {
    throw new Error('Unauthorized: Invitation not intended for this user');
  }

  invitation.status = 'declined';
  await invitation.save();
};

export default { getUserInvitations, acceptInvitation, declineInvitation };