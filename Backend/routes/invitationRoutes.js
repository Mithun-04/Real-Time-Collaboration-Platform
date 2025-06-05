import express from 'express';
import invitationController from '../controllers/invitationController.js';
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.get('/', authMiddleware, invitationController.getUserInvitations);
router.post('/accept', authMiddleware, invitationController.acceptInvitation);
router.post('/decline', authMiddleware, invitationController.declineInvitation);

export default router;