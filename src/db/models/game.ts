import { model, models, Schema, Types } from "mongoose";

const GameSchema = new Schema({
    group: {type: Types.ObjectId, ref: "Group"},
    name: String,
    teamsize: Number,
    players: [{type: Types.ObjectId, ref: "Player"}],
    createdAt: {type: Date, default: Date.now},
})

const Game = models.Player || model("Game", GameSchema);
export default Game;