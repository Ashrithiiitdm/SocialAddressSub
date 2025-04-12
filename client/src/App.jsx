import React from "react";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import LoginForm from "./pages/Login.jsx";

function App() {
	return (
		<BrowserRouter>
			{" "}
			{/* Wrap the app with BrowserRouter */}
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<LoginForm />
			</div>
		</BrowserRouter>
	);
}

export default App;
