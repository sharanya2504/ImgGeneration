const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Replace <username>, <password>, <dbname> with your Atlas details
    await mongoose.connect(
      "mongodb+srv://sharanyalakkamsetti_db_user:37HzVqWgVCfEcUF5@cluster0.evrgsml.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Atlas connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
