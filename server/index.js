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

const checkUserId = (req, res, next) => {
  const userId = req.header("X-User-Id");

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  req.userId = userId;
  next();
};

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
        res
          .status(200)
          .json({ message: "Login successful!", userId: data.rows[0].id });
        res.send("Login successful!");
      } else {
        res.status(401).send("Login failed!");
      }
    })
    .catch((err) => console.log(err));
});

app.post("/api/tasks", checkUserId, async (req, res) => {
  const { name } = req.body;
  const userId = req.userId;

  const query = "INSERT INTO tasks (name, user_id) VALUES ($1, $2) RETURNING *";

  try {
    const result = await client.query(query, [name, userId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Could not create task" });
  }
});

app.get("/api/tasks", checkUserId, async (req, res) => {
  const userId = req.userId;

  const query = "SELECT * FROM tasks WHERE user_id = $1";

  try {
    const result = await client.query(query, [userId]);
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Could not retrieve tasks" });
  }
});

app.delete("/api/tasks/:id", checkUserId, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const query = "DELETE FROM tasks WHERE id = $1 AND user_id = $2";

  try {
    await client.query(query, [id, userId]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Could not delete task" });
  }
});

app.put("/api/tasks/:id", checkUserId, async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  const userId = req.userId;

  const query =
    "UPDATE tasks SET stage=$1 WHERE id=$2 AND user_id=$3 RETURNING *";

  try {
    const result = await client.query(query, [stage, id, userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Could not update task" });
  }
});

app.put("/api/tasks/:id/name", checkUserId, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.userId;

  const query =
    "UPDATE tasks SET name=$1 WHERE id=$2 AND user_id=$3 RETURNING *";

  try {
    const result = await client.query(query, [name, id, userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Could not update task" });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
