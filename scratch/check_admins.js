import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://crickbet:crickbuzzbettingXXXX@cricbuzz.40erabd.mongodb.net/";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: String,
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

async function checkAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    const admins = await UserModel.find({ role: 'admin' });
    console.log("Found admins:", JSON.stringify(admins, null, 2));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkAdmins();
