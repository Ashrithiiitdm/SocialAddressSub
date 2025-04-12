import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
	job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
	student_id: {
		type: String,
		required: true,
		
	},
	name: String,
	email: String,
	resumeLink: String,
	coverLetter: String,
	appliedAt: { type: Date, default: Date.now },
});

const internshipSchema = new mongoose.Schema({
	job_id: {
		type: String,
		unique: true,
		required: true,
	},
	title: String,
	company: String,
	location: String,
	role: String,
	description: String,
	created_at: { type: Date, default: Date.now },
	recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" },
	applications: [applicationSchema],
});

export const Internships =
	mongoose.model("Internships", internshipSchema) ||
	mongoose.models("Internships");
