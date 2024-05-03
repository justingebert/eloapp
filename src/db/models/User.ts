import mongoose from "mongoose";

interface IUser extends mongoose.Document{  
    username: string;
    createdAt: Date;
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
    this.elo.push(elo);
    return this.save();
}

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
