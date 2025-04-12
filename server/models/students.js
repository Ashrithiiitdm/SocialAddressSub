import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
	student_id: {
		type: String,
		unique: true,
		required: true,
	},

	name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		unique: true,
		required: true,
	},

	password: {
		type: String,
		required: true,
	},

	created_at: {
		type: Date,
		default: Date.now,
	},

	profile_picture: {
		type: String,
	},

	internships_applied: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Internship",
		},
	],
});

export const Students =
	mongoose.model("Students", studentSchema) || mongoose.models("Students");
