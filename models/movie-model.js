import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		releaseYear: {
			type: Number,
		},
		genre: [],
		direactor: {
			type: String,
		},
		actor: [],
		language: [],
		country: {
			type: String,
		},
		rating: {
			type: Number,
			min: 0,
			max: 10,
		},
		plot: {
			type: String,
		},
		award: {
			type: String,
		},
		posterUrl: {
			type: String,
		},
		trailerUrl: {
			type: String,
		},
		review: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "review",
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("movies", movieSchema);
