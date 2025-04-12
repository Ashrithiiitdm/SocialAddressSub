import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./db.js";
import { connectCloudinary } from "./middleware/cloudinary.js";
import studentRouter from "./routes/student.js";
import recruiterRouter from "./routes/recruiter.js";


const app = express();

connectDB();
connectCloudinary();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

app.get("/", (req, res) => {
	res.send("Hello world");
});

app.use('/api/students', studentRouter);
app.use('/api/recruiters', recruiterRouter);

app.listen(port, () => {
	console.log("Server is listening at port ", port);
});
