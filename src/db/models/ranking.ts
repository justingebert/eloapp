import { model, models, Schema, Types } from "mongoose";

const RankingSchema = new Schema({
    group: {type: Types.ObjectId, ref: "Group"},
    game: {type: Types.ObjectId, ref: "Game"},
    match: {type: Types.ObjectId, ref: "Match"},
    player: {type: Types.ObjectId, ref: "Player"},
    rating: Number,
    createdAt: {type: Date, default: Date.now},
})

const Ranking = models.Ranking  || model("Ranking", RankingSchema);
export default Ranking;