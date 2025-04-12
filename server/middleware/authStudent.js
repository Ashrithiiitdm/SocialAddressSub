import jwt from "jsonwebtoken";

export const authStudent = async (req, res, next) => {
	const { token } = req.body;

	if (!token) {
		return res.status(401).json({
			message: "Not authorized, login again",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		//console.log(decoded);
		req.body.student_id = decoded.student__id;
		next();
	} catch (err) {
		console.log(err);
		return res.json({
			success: false,
			message: err.message,
		});
	}
};
