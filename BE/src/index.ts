import "reflect-metadata";

// Import app directly without complex DI
import app from "./app.js";
import { config } from "./config/config.js";

app.set('port', config.port);

app.listen(app.get('port'), () => {
  console.log(`🚀 Server is running on http://localhost:${config.port}`);
  console.log(`📡 API endpoints: http://localhost:${config.port}/api/products`);
});