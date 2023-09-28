import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		movieId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "movies",
			required: true,
		},
		userId: {
			type: String,
			required: true,
			ref: "users",
		},
		rating: {
			type: Number,
			default: 0,
		},
		reviewText: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("review", reviewSchema);
