import { app } from "./app";
import { config } from "./config/config";
import { connectDatabase } from "./config/database";

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(
        `⚡️[server]: Server is running in ${config.env} mode on port ${PORT}`,
      );
    });
  } catch (error: any) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();
