import app from "./index.js";
import sequelize from "./db/sequelize.js";
import Users from "./db/models/Users.js";

const PORT = 3001;

async function connectWithRetry() {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log(`Database connected on port ${PORT}!`);

      await sequelize.sync();

      app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
      });

      break;
    } catch (err) {
      console.log("Failed to connect to DB, retrying in 3 seconds...");
      retries--;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}

connectWithRetry();
