import { Recruiter } from "../models/recruiter.js";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { Internships } from "../models/internship.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signToken = async (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

export const recruiterRegister = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				message: "Please fill all the fields",
			});
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({
				message: "Please enter a valid email",
			});
		}

		const existingUser = await Recruiter.findOne({ email });

		if (existingUser) {
			return res.status(400).json({
				message: "User already exists",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const recruiter = await Recruiter.create({
			name: name,
			email: email,
			password: hashedPassword,
		});

		await recruiter.save();

		const token = await signToken(recruiter._id);

		return res.status(200).json({
			message: "user registered successfully",
			token,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error registering",
		});
	}
};

export const recruiterLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Please fill all the fields",
			});
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({
				message: "Please enter a valid email",
			});
		}

		const findUser = await Recruiter.findOne({ email });

		if (!findUser) {
			return res.status(400).json({
				message: "User does not exist",
			});
		}

		const flag = bcrypt.compare(password, findUser.password);

		if (!flag) {
			return res.status(400).json({
				message: "Invalid password",
			});
		}

		const token = await signToken(findUser._id);
		return res.status(200).json({
			message: "user logged in successfully",
			token,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error logging in",
		});
	}
};

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
