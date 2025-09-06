const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server is running 🎉');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port ' + (process.env.PORT || 3000));
});
