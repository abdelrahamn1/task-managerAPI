const mongoose = require("mongoose");

require("dotenv").config();
const app = require("./app");

//connect DataBase
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Coonected Suuccesfuly!");
  })
  .catch((err) => {
    console.log(`ERROR 💥 : ${err}`);
  });

//SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
