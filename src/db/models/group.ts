import { model, models, Schema, Types } from "mongoose";

const GroupSchema = new Schema({
    name: String,
    passphrase: String,
    createdAt: {type: Date, default: Date.now},
    players: [{type: Types.ObjectId, ref: "Player"}],
})


const Group = models.Group || model("Group", GroupSchema);
export default Group;