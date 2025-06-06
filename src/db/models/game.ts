import { model, models, Schema, Types } from "mongoose";

const GameSchema = new Schema({
    group: {type: Types.ObjectId, ref: "Group"},
    name: {type: String, required: true},
    icon: String,
    teamsize: {type: Number , default: 0},
    players: [{type: Types.ObjectId, ref: "Player"}],
    createdAt: {type: Date, default: Date.now},
})

const Game = models.Game || model("Game", GameSchema);
export default Game;