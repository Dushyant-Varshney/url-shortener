const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(
            process.env.CONNECTION_STRING,
            {
                tls: true,
                serverSelectionTimeoutMS: 5000,
            }
        );

        console.log(
            "Database Connected:",
            connect.connection.host,
            connect.connection.name
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDb;