const express=require('express')
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index"

const app = express();
// Important: ensure you add JSON middleware to process incoming JSON POST payloads.
app.use(express.json());
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

