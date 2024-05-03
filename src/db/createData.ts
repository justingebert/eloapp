import mongoose from "mongoose";
import User from "./models/User";
require('dotenv').config({ path: './.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

/* if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
} */

mongoose.connect('mongodb://localhost:27017/eloapp', {
});

const createData = async () => {
    
    const users = [
        {
          username: "Justin",
        },
        {
          username: "Till",
        },
        {
          username: "Tomas",
        },
        {
          username: "Theo",
        },
        {
          username: "Flo",
        },
        {
          username: "Lasse",
        },
    ];

    
    await User.deleteMany({});
    await User.insertMany(users);
}

createData().then(() => {
    console.log("Data created successfully");
    process.exit();
}).catch((error) => {
    console.log("Error creating data", error);
    process.exit(1);
})