import { model, models, Schema, Types } from "mongoose";

const MatchSchema = new Schema({
    group: {type: Types.ObjectId, ref: "Group"},
    game: {type: Types.ObjectId, ref: "Game"},
    teams: [{type: Types.ObjectId, ref: "Team"}],
    winnerIndex: Number,
    createdAt: {type: Date, default: Date.now},
})

const Match = models.Match || model("Match", MatchSchema);
export default Match;