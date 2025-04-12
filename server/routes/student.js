import { Router } from "express";
import {
	removeProfile,
	studentLogin,
	studentRegister,
	updateProfile,
	applyInternship,
	uploadResume,
	getAppliedInternships,
} from "../controllers/studentController.js";
import upload from "../middleware/multer.js";
import { authStudent } from "../middleware/authStudent.js";

const studentRouter = Router();

studentRouter.post("/student-register", studentRegister);
studentRouter.post("/student-login", studentLogin);
studentRouter.post(
	"/update-profile",
	authStudent,
	upload.single("file"),
	updateProfile
);
studentRouter.delete("/delete-profile", authStudent, removeProfile);
studentRouter.post("/apply-internship", authStudent, applyInternship);
studentRouter.post(
	"/upload-resume",
	authStudent,
	upload.single("file"),
	uploadResume
);
studentRouter.get(
	"/get-applied-internships/",
	authStudent,
	getAppliedInternships
);
// studentRouter.post("/logout");

export default studentRouter;
