import { httpServer } from "./app";
import { config } from "./config/config";
import { connectDatabase } from "./config/database";
const startServer = async () => {
    try {
        await connectDatabase();
        const PORT = config.port;
        httpServer.listen(PORT, () => {
            console.log(`⚡️[server]: Server is running in ${config.env} mode on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error.message);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map