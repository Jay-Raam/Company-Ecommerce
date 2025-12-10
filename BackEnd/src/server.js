import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = 4000;

connectDB();

app.listen(PORT, () => {
  console.log(`GraphQL server running on http://localhost:${PORT}/graphql`);
});
