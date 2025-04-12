import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "../../axios.js";

const LoginForm = ({ role }) => {
	const navigate = useNavigate();

	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleAuth = async (e) => {
		e.preventDefault();
		if (!email || !password || (!isLogin && !name)) {
			toast.error("Please fill in all required fields.");
			return;
		}

		try {
			const endpoint = isLogin
				? role === "student"
					? "/api/student-login" // API for student login
					: "/api/recruiter-login" // API for recruiter login
				: role === "student"
				? "/api/student-register" // API for student register
				: "/api/recruiter-register"; // API for recruiter register

			const payload = isLogin ? { email, password } : { name, email, password };

			const response = await axios.post(endpoint, payload, {
				withCredentials: true,
			});

			if (response.data.user?.user_id) {
				toast.success(isLogin ? "Login successful" : "Registration successful");
				navigate("/dashboard");
			}
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
			<div className="bg-white p-8 shadow-xl rounded-3xl w-full max-w-md space-y-6">
				<h1 className="text-2xl font-bold text-center">
					{isLogin
						? `Welcome Back, ${role === "student" ? "Student" : "Recruiter"}`
						: `Create an Account as ${
								role === "student" ? "Student" : "Recruiter"
						  }`}
				</h1>
				<form onSubmit={handleAuth} className="space-y-6">
					{!isLogin && role === "student" && (
						<div className="space-y-4">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
					)}
					<div className="space-y-4">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="space-y-4">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox id="remember" />
						<Label htmlFor="remember" className="text-sm font-normal">
							Remember me
						</Label>
					</div>
					<Button
						type="submit"
						className="w-full bg-purple-600 hover:bg-purple-700"
					>
						{isLogin ? "Sign In" : "Sign Up"}
					</Button>
					<div className="text-center text-sm text-gray-500">
						{isLogin ? "Don't have an account?" : "Already have an account?"}
						<span
							onClick={() => setIsLogin(!isLogin)}
							className="text-purple-600 font-medium cursor-pointer hover:underline"
						>
							{isLogin ? "Sign up" : "Sign in"}
						</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
