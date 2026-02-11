import app from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { ENV } from "./config/env.js";

async function startServer() {
    await connectMongo();

    app.listen(ENV.PORT, () => {
        console.log(`🚀 Server running on port ${ENV.PORT}`);
    });
}

startServer();
