const express = require("express");
const { Client } = require("pg");
const app = express();

const client = new Client(
  "postgres://user:password@db/task_manager?sslmode=disable"
);

client
  .connect()
  .then(() => console.log("Connected to DB!"))
  .catch((err) => console.log(err));

const port = 9000;

app.use(express.json());

app.post("/api/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`;
  client
    .query(query)
    .then(() => res.send("User created!"))
    .catch((err) => console.log(err));
});

app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  client
    .query(query)
    .then((data) => {
      if (data.rows.length > 0) {
        res.send("Login successful!");
      } else {
        res.send("Login failed!");
      }
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
