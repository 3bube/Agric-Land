"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FavoriteSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    land: { type: mongoose_1.Schema.Types.ObjectId, ref: "Land", required: true },
}, { timestamps: true });
const Favorite = (0, mongoose_1.model)("Favorite", FavoriteSchema);
exports.default = Favorite;
