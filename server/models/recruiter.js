import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
	recruiter_id: { type: String, unique: true, required: true },
	name: String,
	email: { type: String, unique: true },
	password: String,
	profile_picture: {
		type: String,
	},
	company: String,
	postedInternships: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
	],
});

export const Recruiter =
	mongoose.model("Recruiter", recruiterSchema) || mongoose.models("Recruiter");
