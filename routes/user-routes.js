import express from "express";
import {
	addMovies,
	addReviewToMovies,
	createUser,
	getMovieReviews,
	getUserByPhoneNumber,
	loginUser,
	updateContactDetail,
	updatePassword,
	updateProfilePic,
} from "../controller/user-controller.js";
import { checkAuth } from "../middleware/checkAuth.js";

const Router = express.Router();

Router.post("/auth/signup", createUser);
Router.get("/auth/login", loginUser);
Router.post("/profile/update-password", checkAuth, updatePassword);
Router.post("/profile/update-profile-picture", checkAuth, updateProfilePic);
Router.post("/profile/update-contact-detail", checkAuth, updateContactDetail);
Router.get("/phone/:phoneNumber", getUserByPhoneNumber);
Router.post("/movies/review/:movieId", checkAuth, addReviewToMovies);
Router.get("/movies/:movieId/reviews", getMovieReviews);
Router.post("/movies/add-movie", addMovies);
export default Router;
