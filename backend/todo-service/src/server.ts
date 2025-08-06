import app from './index.js';
import sequelize from './db/sequelize.js';
import Todo from './db/models/Todos.js';

const PORT = 3000;

async function connectWithRetry() {
  let retries = 10;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log(`Database connected on port ${PORT}!`);

      await sequelize.sync({ alter: true });
      
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });

      break;
    } catch (err) {
      console.log('Failed to connect to DB, retrying in 3 seconds...');
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }
}

connectWithRetry();
