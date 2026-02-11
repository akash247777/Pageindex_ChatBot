import express from "express";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api", chatRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;
