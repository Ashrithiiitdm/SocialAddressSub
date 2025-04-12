import React, { useState } from "react";
import LoginForm from "./Login.jsx"; // Import the LoginForm component

const RoleSelection = () => {
	const [role, setRole] = useState(null);

	const handleRoleSelection = (role) => {
		setRole(role);
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
			{role ? (
				<LoginForm role={role} />
			) : (
				<div className="bg-white p-8 shadow-xl rounded-3xl w-full max-w-md space-y-6">
					<h1 className="text-2xl font-bold text-center">Select Your Role</h1>
					<div className="flex justify-center space-x-4">
						<button
							onClick={() => handleRoleSelection("student")}
							className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							Are you a Student?
						</button>
						<button
							onClick={() => handleRoleSelection("recruiter")}
							className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
						>
							Are you a Recruiter?
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default RoleSelection;
