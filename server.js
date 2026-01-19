const express = require("express");
const app = express();
const PORT = express.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("API");
});

app.listen(PORT, () => {
  console.log(`Server Running On PORT${PORT}`);
});
