import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./db/db.js";

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(
        `App is listening on port ${port} in ${process.env.NODE_ENV} mode`
      );
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
