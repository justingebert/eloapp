import mongoose from "mongoose";
require('dotenv').config({ path: '../../.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}



const createData = async () => {
    
  await mongoose.connect(MONGODB_URI, {});

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

    
    // await User.deleteMany({});
    // await User.insertMany(users);
}

createData().then(() => {
    console.log("Data created successfully");
    process.exit();
}).catch((error) => {
    console.log("Error creating data", error);
    process.exit(1);
})