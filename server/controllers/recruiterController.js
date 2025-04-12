import { Recruiter } from "../models/recruiter.js";
import { v4 as uuidv4 } from "uuid";

import { Internships } from "../models/internship.js";

export const postJobApplication = async (req, res) => {
	try {
		const { title, recruiter_id, company, location, role, description } =
			req.body;

		if (!title || !company || !location || !role || !description) {
			return res.status(400).json({
				message: "Please fill all the fields",
			});
		}

		const job_id = String(uuidv4.v4());

		const newJob = new Internships({
			job_id,
			title,
			company,
			location,
			role,
			description,
			recruiter_id,
		});

		await newJob.save();
		const recruiter = await Recruiter.findById(recruiter_id);
		recruiter.postedInternships.push(newJob._id);

		await recruiter.save();
		return res.status(200).json({
			message: "Job posted successfully",
			job_id,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error occurred while postin for the job",
		});
	}
};

export const getApplicants = async (req, res) => {
	try {
		const { job_id } = req.params;

		const internship = await Internships.findOne({ job_id }).populate(
			"applications.student_id"
		);

		if (!internship) {
			return res.status(404).json({
				message: "Internship not found",
			});
		}

		const applicants = internship.applications.map((application) => ({
			student_id: application.student_id.student_id,
			name: application.student_id.name,
			email: application.student_id.email,
			resumeLink: application.resumeLink,
			coverLetter: application.coverLetter,
		}));

		return res.status(200).json({
			message: "Applicants fetched successfully",
			applicants,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error occurred while getting applicants",
		});
	}
};

export const deleteInternship = async (req, res) => {
	try {
		const { job_id } = req.params;

		const internship = await Internships.findOneAndDelete({ job_id });

		if (!internship) {
			return res.status(404).json({
				message: "Internship not found",
			});
		}

		const recruiter = await Recruiter.findById(internship.recruiter);

		recruiter.postedInternships.pull(internship._id);

		await recruiter.save();

		return res.status(200).json({
			message: "Internship deleted successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error occurred while deleting internship",
		});
	}
};
