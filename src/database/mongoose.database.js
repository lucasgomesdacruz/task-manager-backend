const mongoose = require("mongoose");

const connectToDatabase = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fsctaskmanagercluster.zd9do5a.mongodb.net/?retryWrites=true&w=majority&appName=FscTaskManagerCluster`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        throw err;
    }
};

module.exports = connectToDatabase;
