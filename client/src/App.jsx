import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter, Routes, and Route
import LoginForm from "./pages/Login.jsx";
import RoleSelector from "./pages/RoleSelector.jsx";
import ApplicantDashboard from "./pages/ApplicantDashboard.jsx";
import EmployerDashboard from "./pages/EmployerDashboard.jsx";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<RoleSelector />} />
				<Route path="/login" element={<LoginForm />} />
				<Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
				<Route path="/employer-dashboard" element={<EmployerDashboard />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
