import movieModel from "../models/movie-model.js";
import reviewModel from "../models/review-model.js";
import userModel from "../models/user-model.js";
import { generateToken } from "../services/jwt-token.js";

//@desc creating new user
// Route POST /v1/api/users/auth/signup
export const createUser = async (req, res) => {
	const { userName, name, email, password, profileUrl, phoneNumber } = req.body;
	try {
		const isExist = await userModel.findOne({ email: email });
		if (isExist) {
			return res.status(409).json({
				message: "Email already exist",
				success: false,
			});
		}
		const newUser = new userModel({
			userName: userName,
			name: name,
			email: email,
			password: password,
			profileUrl: profileUrl,
			phoneNumber: phoneNumber,
		});
		const savedUser = await newUser.save();
		if (!savedUser) {
			return res.status(409).json({
				message: "Error while creating the User",
				success: fasle,
			});
		} else {
			return res.status(201).json({
				message: "New User Created Successfully",
				success: true,
				data: savedUser,
			});
		}
	} catch (error) {
		throw error;
	}
};

//@desc login user
//Route GET /v1/api/users/auth/login

export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(403).send("Please provide valid credentials");
		}
		const foundUser = await userModel.findOne({ email: email });

		if (!foundUser) {
			return res.status(403).json({
				message: "User does not exist",
				success: false,
			});
		}
		if (password !== foundUser.password) {
			return res
				.status(406)
				.json({ message: "Password incorrect", success: false });
		}
		const sendDetails = await userModel
			.findById({ _id: foundUser._id })
			.select("-password -__v");

		return res.status(200).json({
			message: "User logged in successfully",
			success: true,
			data: {
				foundUer: sendDetails,
				encodedToken: generateToken({ id: foundUser._id }),
			},
		});
	} catch (error) {
		throw error;
	}
};

//@desc update password of user
//Route POST /v1/api/users/profile/update-password
export const updatePassword = async (req, res) => {
	const { id } = req.user;
	const { currentPassword, newPassword } = req.body;
	try {
		const foundUer = await userModel.findById({ _id: id });
		if (!foundUer) {
			return res.status(500).json({ message: "No User Found", success: false });
		}
		if (currentPassword !== foundUer.password) {
			return res
				.status(409)
				.json({ message: "Current Password is Incorrect", success: false });
		}
		const updatedData = await userModel
			.findByIdAndUpdate(
				{ _id: id },
				{ $set: { password: newPassword } },
				{ new: true }
			)
			.select("-password");
		return res.json({
			message: "Password updated successfully",
			success: true,
			data: updatedData,
		});
	} catch (error) {
		throw error;
	}
};

//@desc change profile picture url
//Route POST /v1/api/users/profile/update-prfile-picture

export const updateProfilePic = async (req, res) => {
	const { id } = req.user;
	const { newProfilePicture } = req.body;

	try {
		const foundUer = await userModel.findById({ _id: id });
		if (!foundUer) {
			return res.status(404).json({
				message: "User not found",
				success: false,
			});
		}
		const updatedData = await userModel
			.findByIdAndUpdate(
				{ _id: foundUer._id },
				{ $set: { profileUrl: newProfilePicture } },
				{ new: true }
			)
			.select("-password");
		return res.status(200).json({
			message: "Profile picture updated successfully",
			success: true,
			data: updatedData,
		});
	} catch (error) {
		throw error;
	}
};
//@desc update contact details
//Route POST /v1/api/users/profile/update-contact-detail

export const updateContactDetail = async (req, res) => {
	const { id } = req.user;
	const { newphone, newAddress } = req.body;

	try {
		const foundUer = await userModel.findById({ _id: id });
		if (!foundUer) {
			return res.status(404).json({
				message: "User not found",
				success: false,
			});
		}
		const updatedData = await userModel
			.findByIdAndUpdate(
				{ _id: foundUer._id },
				{ $set: { phoneNumber: newphone, address: newAddress } },
				{ new: true }
			)
			.select("-password");

		return res.status(200).json({
			message: "Contact detail updated successfully",
			success: true,
			data: updatedData,
		});
	} catch (error) {
		throw error;
	}
};

//@desc retrive user by phone number
//Route GET /v1/api/users/phone/:phoneNumber

export const getUserByPhoneNumber = async (req, res) => {
	const { phoneNumber } = req.params;
	try {
		const userData = await userModel
			.findOne({ phoneNumber })
			.select("-password -__v");
		if (!userData) {
			return res.status(404).json({
				message: "User not found",
				success: false,
			});
		}
		return res.status(200).json({
			message: "User fetch successfully",
			success: true,
			data: userData,
		});
	} catch (error) {
		throw error;
	}
};

//@desc adding review to movie
//Route POST /v1/api/users/movies/addreview

export const addReviewToMovies = async (req, res) => {
	const { movieId } = req.params;
	const { reviewText, rating } = req.body;
	const { id } = req.user;

	try {
		if (!reviewText || !rating) {
			return res.status(400).json({
				message: "Missing fields",
				success: false,
			});
		}
		const foundMovie = await movieModel.findById({ _id: movieId });
		if (!foundMovie) {
			return res.status(404).json({
				message: "Movie not found",
				success: false,
			});
		}
		const newReview = new reviewModel({
			movieId: foundMovie._id,
			userId: id,
			reviewText: reviewText,
			rating: rating,
		});
		await newReview.save();
		await movieModel.updateOne(
			{ _id: movieId },
			{
				$push: { review: newReview._id },
			}
		);
		return res.status(200).json({
			message: "Review added successfully",
			success: true,
			data: newReview,
		});
	} catch (error) {
		throw error;
	}
};
//@desc get all review of a movie
//Route GET /v1/api/users/movies/:movieId/reviews

export const getMovieReviews = async (req, res) => {
	const { movieId } = req.params;
	try {
		const foundReviews = await reviewModel
			.find({ movieId: movieId })
			.populate({
				path: "userId",
				select: "-__v -createdAt -password",
			})
			.select("-movieId -__v -updatedAt");
		if (!foundReviews.length) {
			return res.status(404).json({
				message: "Review not Found for this movie",
				success: false,
			});
		}
		return res.status(200).json({
			message: "Review Load successfully",
			success: true,
			data: foundReviews,
		});
	} catch (error) {
		throw error;
	}
};

export const addMovies = async (req, res) => {
	const {
		title,
		releaseYear,
		genre,
		director,
		actors,
		language,
		country,
		rating,
		plot,
		award,
		posterUrl,
		trailerUrl,
	} = req.body;
	try {
		const newMovie = new movieModel({
			title: title,
			releaseYear: releaseYear,
			genre: genre,
			director: director,
			actor: actors,
			language: language,
			country: country,
			rating: rating,
			plot: plot,
			award: award,
			posterUrl: posterUrl,
			trailerUrl: trailerUrl,
		});
		await newMovie.save();
		return res.json({
			message: "Movie added success",
			success: true,
			data: newMovie,
		});
	} catch (error) {
		console.log(error);
	}
};
