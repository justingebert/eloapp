import mongoose from "mongoose";

export interface IUser extends mongoose.Document{  
    username: string;
    createdAt: Date;
    elo: number[];
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date, 
        default: Date.now,
    },
    elo: {
        type: [Number],
        default: [100]
    },
});

UserSchema.methods.addElo = function (elo: number) {
    const adjustedElo = Math.max(elo, 0);
    this.elo.push(adjustedElo);
    return this.save();
}

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
