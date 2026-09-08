const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Wedding backend ishlayapti!",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API ishlayapti!",
  });
});

app.listen(3000, () => {
  console.log("Server http://localhost:3000 da ishlayapti");
});
