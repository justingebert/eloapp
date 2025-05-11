import { model, models, Schema, Types } from "mongoose";

const TeamSchema = new Schema({
    group: {type: Types.ObjectId, ref: "Group"},
    game: {type: Types.ObjectId, ref: "Game"},
    players: [{type: Types.ObjectId, ref: "Player"}],
    createdAt: {type: Date, default: Date.now},
})

const Team = models.Player || model("Team", TeamSchema);
export default Team;