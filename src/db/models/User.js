"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.default.Schema({
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
UserSchema.methods.addElo = function (elo) {
    this.elo.push(elo);
    return this.save();
};
var User = mongoose_1.default.models.User || mongoose_1.default.model("User", UserSchema);
exports.default = User;
