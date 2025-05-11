import { model, models, Schema, Types } from "mongoose";

const PlayerSchema = new Schema({
    group: {type: Types.ObjectId, ref: "Group"},
    name: String,
    createdAt: {type: Date, default: Date.now},
})

const Player = models.Player || model("Player", PlayerSchema);
export default Player;