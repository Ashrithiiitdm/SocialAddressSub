import React, { useState, useEffect } from "react";
import axios from "../../axios";

const EmployerDashboard = () => {
	const [internships, setInternships] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		company: "",
		location: "",
		role: "",
		description: "",
	});

	useEffect(() => {
		const fetchInternships = async () => {
			try {
				const response = await axios.get("/api/recruiters/internships");
				setInternships(response.data.internships);
			} catch (error) {
				console.error("Error fetching internships:", error);
			}
		};

		fetchInternships();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handlePostInternship = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/api/recruiters/post-job", formData);
			alert(response.data.message);
			setFormData({
				title: "",
				company: "",
				location: "",
				role: "",
				description: "",
			});
		} catch (error) {
			console.error("Error posting internship:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<h1 className="text-2xl font-bold text-center mb-6">
				Employer Dashboard
			</h1>
			<form
				onSubmit={handlePostInternship}
				className="bg-white p-4 shadow rounded-lg mb-6"
			>
				<h2 className="text-xl font-semibold mb-4">Post a New Internship</h2>
				<input
					type="text"
					name="title"
					placeholder="Title"
					value={formData.title}
					onChange={handleInputChange}
					className="w-full p-2 border rounded mb-4"
				/>
				<input
					type="text"
					name="company"
					placeholder="Company"
					value={formData.company}
					onChange={handleInputChange}
					className="w-full p-2 border rounded mb-4"
				/>
				<input
					type="text"
					name="location"
					placeholder="Location"
					value={formData.location}
					onChange={handleInputChange}
					className="w-full p-2 border rounded mb-4"
				/>
				<input
					type="text"
					name="role"
					placeholder="Role"
					value={formData.role}
					onChange={handleInputChange}
					className="w-full p-2 border rounded mb-4"
				/>
				<textarea
					name="description"
					placeholder="Description"
					value={formData.description}
					onChange={handleInputChange}
					className="w-full p-2 border rounded mb-4"
				></textarea>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white p-2 rounded"
				>
					Post Internship
				</button>
			</form>

			<h2 className="text-xl font-semibold mb-4">Your Posted Internships</h2>
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
					</div>
				))}
			</div>
		</div>
	);
};

export default EmployerDashboard;
