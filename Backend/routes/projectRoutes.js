import { Router } from 'express';
import projectController from "../controllers/projectController.js";
//import { authMiddleware, managerMiddleware } from '../middleware/authMiddleware.js';
import authMiddleware from "../middleware/authMiddleware.js";






const router = Router();

router.post('/', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getProjects);
router.get('/:id', authMiddleware, projectController.getProjectById);
router.post('/:id/invite', authMiddleware, projectController.inviteMembers);


export default router;