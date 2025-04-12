import { Router } from "express";
import { authRecruiter } from "../middleware/authRecruiter.js";
import {
	postJobApplication,
	getApplicants,
	deleteInternship,
	recruiterRegister,
	recruiterLogin,
} from "../controllers/recruiterController.js";

const recruiterRouter = Router();
recruiterRouter.post("/recruiter-regsiter", recruiterRegister);
recruiterRouter.post("/recruiter-login", recruiterLogin)
recruiterRouter.post("/post-job", authRecruiter, postJobApplication);
recruiterRouter.get("/applicants/:job_id", authRecruiter, getApplicants);
recruiterRouter.delete("/delete-job/:job_id", authRecruiter, deleteInternship);

export default recruiterRouter;
