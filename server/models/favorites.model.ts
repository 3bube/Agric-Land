import { Schema, model } from "mongoose";

const FavoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    land: { type: Schema.Types.ObjectId, ref: "Land", required: true },
  },
  { timestamps: true }
);

const Favorite = model("Favorite", FavoriteSchema);

export default Favorite;
