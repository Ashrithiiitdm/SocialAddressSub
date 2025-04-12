import React, { useEffect, useState } from "react";
import axios from "../../axios";

const ApplicantDashboard = () => {
	const [internships, setInternships] = useState([]);
	const [appliedInternships, setAppliedInternships] = useState([]);

	useEffect(() => {
		const fetchInternships = async () => {
			try {
				const response = await axios.get("/api/internships");
				setInternships(response.data.internships);
			} catch (error) {
				console.error("Error fetching internships:", error);
			}
		};

		fetchInternships();
	}, []);

	const handleApply = async (job_id) => {
		try {
			const response = await axios.post("/api/students/apply-internship", {
				job_id,
				student_id: "example_student_id", // Replace with actual student ID
			});
			alert(response.data.message);
			setAppliedInternships([...appliedInternships, job_id]);
		} catch (error) {
			console.error("Error applying for internship:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<h1 className="text-2xl font-bold text-center mb-6">
				Applicant Dashboard
			</h1>
			<h2 className="text-xl font-semibold mb-4">Available Internships</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{internships.map((internship) => (
					<div
						key={internship.job_id}
						className="bg-white p-4 shadow rounded-lg"
					>
						<h2 className="text-xl font-semibold">{internship.title}</h2>
						<p className="text-gray-600">Company: {internship.company}</p>
						<p className="text-gray-600">Location: {internship.location}</p>
						<p className="text-gray-600">Role: {internship.role}</p>
						<p className="text-gray-600">
							Description: {internship.description}
						</p>
						<button
							onClick={() => handleApply(internship.job_id)}
							className="mt-4 w-full bg-green-600 text-white p-2 rounded"
							disabled={appliedInternships.includes(internship.job_id)}
						>
							{appliedInternships.includes(internship.job_id)
								? "Applied"
								: "Apply"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ApplicantDashboard;
