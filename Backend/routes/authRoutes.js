import express from "express";
import { signup, login} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// router.get("/profile", getUserName); // Uncomment if you have a profile route

export default router;