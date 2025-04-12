import { Router } from "express";
import { authRecruiter } from "../middleware/authRecruiter.js";
import {
	postJobApplication,
	getApplicants,
	deleteInternship,
} from "../controllers/recruiterController.js";

const recruiterRouter = Router();

recruiterRouter.post("/post-job", authRecruiter, postJobApplication);
recruiterRouter.get("/applicants/:job_id", authRecruiter, getApplicants);
recruiterRouter.delete("/delete-job/:job_id", authRecruiter, deleteInternship);


export default recruiterRouter;
