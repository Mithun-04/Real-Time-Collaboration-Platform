import invitationService from "../service/invitationService.js";

const getUserInvitations = async (req, res) => {
  try {
    const userId = req.user.id;
    const invitations = await invitationService.getUserInvitations(userId);
    res.status(200).json({
      success: true,
      data: invitations,
      message: "Invitations retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve invitations",
    });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.body;
    const userId = req.user.id;
    const project = await invitationService.acceptInvitation(invitationId, userId);
    res.status(200).json({
      success: true,
      data: project,
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to accept invitation",
    });
  }
};

const declineInvitation = async (req, res) => {
  try {
    const { invitationId } = req.body;
    const userId = req.user.id; // Changed from req.user._id to req.user.id for consistency
    await invitationService.declineInvitation(invitationId, userId);
    res.status(200).json({
      success: true,
      message: "Invitation declined successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to decline invitation",
    });
  }
};

export default {
  getUserInvitations,
  acceptInvitation,
  declineInvitation,
};
