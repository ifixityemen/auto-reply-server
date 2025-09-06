const express = require('express');
const app = express();


app.get("/rules", (req, res) => {
  res.json([
    { keyword: "مرحبا", reply: "أهلًا وسهلًا بك 👋" },
    { keyword: "شكرا", reply: "العفو 🌹" }
  ]);



app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port ' + (process.env.PORT || 3000));
});
