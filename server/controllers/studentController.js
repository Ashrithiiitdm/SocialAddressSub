import { Students } from "../models/students.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Internships } from "../models/internship.js";
import { v4 as uuidv4 } from "uuid";

export const signToken = async (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

export const studentRegister = async (req, res) => {
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

		const existingUser = await Students.findOne({ email });

		if (existingUser) {
			return res.status(400).json({
				message: "User already exists",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const student_id = String(uuidv4());
		const student = await Students.create({
			student_id,
			name: name,
			email: email,
			password: hashedPassword,
		});

		student.save();

		const token = await signToken(student._id);

		return res.status(200).json({
			message: "user registered successfully",
			token,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: "Error occurred while regsitering",
		});
	}
};

export const studentLogin = async (req, res) => {
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

		const findUser = await Students.findOne({ email });

		if (!findUser) {
			return res.status(400).json({
				message: "User does not exist",
			});
		}

		const flag = await bcrypt.compare(password, findUser.password);

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
		console.log(err.message);
		return res.status(500).json({
			message: "Error occurred while logging in",
		});
	}
};

export const getStudent = async (req, res) => {
	try {
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: "Error occurred while getting student",
		});
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { student_id } = req.body;

		if (!student_id) {
			return res.status(400).json({
				message: "Please fill all the fields",
			});
		}

		if (!req.file) {
			return res.status(400).json({
				message: "Please upload a file",
			});
		}

		const user = await Students.findById(student_id);
		if (!user) {
			return res.status(400).json({
				message: "User does not exist",
			});
		}

		if (user.profile_picture) {
			const public_id = user.image.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(public_id);
		}

		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder: `${user_id}/profile`,
					public_id: req.file.originalname.split(".")[0],
					resource_type: "image",
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
			stream.end(req.file.buffer);
		});

		user.profile_picture = result.secure_url;
		await user.save();

		return res.status(200).json({
			message: "Profile image updated successfully",
			image: result.secure_url,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: "Error occurred while updating profile",
		});
	}
};

export const removeProfile = async (req, res) => {
	try {
		const { student_id } = req.body;
		const user = await Students.findById(student_id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.image) {
			const public_id = user.image.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(public_id);
		}

		user.image = "";
		await user.save();

		return res
			.status(200)
			.json({ message: "Profile image removed successfully" });
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: "Error occurred while removing profile",
		});
	}
};

export const uploadResume = async (req, res) => {
	try {
		const { student_id } = req.body;

		if (!student_id) {
			return res.status(400).json({
				message: "Please fill all the fields",
			});
		}

		if (!req.file) {
			return res.status(400).json({
				message: "Please upload a file",
			});
		}

		const user = await Students.findById(student_id);

		if (!user) {
			return res.status(400).json({
				message: "User does not exist",
			});
		}

		const resumeUpload = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder: `${student_id}/resume`,
					public_id: req.file.originalname.split(".")[0],
					resource_type: "raw",
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
			stream.end(req.file.buffer);
		});

		return res.status(200).json({
			message: "Resume uploaded successfully",
			resumeLink: resumeUpload.secure_url,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: "Error occurred while uploading resume",
		});
	}
};

export const applyInternship = async (req, res) => {
	try {
		const { student_id, job_id, resumeLink } = req.body;

		const user = await Students.findById(student_id);

		const name = user.name;
		const email = user.email;

		const internship = await Internships.findById(job_id);

		const application = {
			job_id: job_id,
			student_id: student_id,
			name: name,
			email: email,
			resumeLink: resumeLink,
		};

		internship.applications.push(application);

		await internship.save();

		user.internships_applied.push(job_id);

		await user.save();

		return res.status(200).json({
			message: "Internship applied successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error occurred while applying internship",
		});
	}
};

export const getInternships = async (req, res) => {
	try {
		const internships = await Internships.find().populate(
			"title company location role description created_at recruiter applications"
		);

		if (!internships) {
			return res.status(404).json({
				message: "No internships found",
			});
		}

		const formattedInternships = internships.map((internship) => ({
			job_id: internship.job_id,
			title: internship.title,
			company: internship.company,
			location: internship.location,
			role: internship.role,
			description: internship.description,
			created_at: internship.created_at,
			recruiter: internship.recruiter.name,
			num_applicants: internship.applications.length,
		}));

		return res.status(200).json({
			message: "Internships fetched successfully",
			internships: formattedInternships,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error occurred while getting internships",
		});
	}
};

export const getAppliedInternships = async (req, res) => {
	try {
		const { student_id } = req.body;

		const applied_internships = await Students.findById(student_id).populate(
			"internships_applied"
		);

		if (!applied_internships) {
			return res.status(404).json({
				message: "No internships found",
			});
		}

		const formattedInternships = applied_internships.internships_applied.map(
			(internship) => ({
				job_id: internship.job_id,
				title: internship.title,
				company: internship.company,
				location: internship.location,
				role: internship.role,
				description: internship.description,
				created_at: internship.created_at,
				recruiter: internship.recruiter.name,
			})
		);

		return res.status(200).json({
			message: "Applied internships fetched successfully",
			applied_internships: formattedInternships,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error occurred while getting applied internships",
		});
	}
};
