import React, { useEffect, useState } from "react";
import axios from "../../axios";

const Home = () => {
	const [internships, setInternships] = useState([]);

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

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<h1 className="text-2xl font-bold text-center mb-6">
				Internship Openings
			</h1>
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

export default Home;
