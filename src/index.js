const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
const users = [];

app.use(cors());
app.use(express.json());

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400);
  }

  request.user = user; // fazemos isso para termos acesso ao user fora da middleware

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });

  response.json({ message: "Usuário criado!" });
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos)
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
