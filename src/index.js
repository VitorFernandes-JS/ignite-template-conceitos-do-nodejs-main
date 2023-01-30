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
    return response.status(404).json({
      error: "Usuário não encontrado",
    });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: "Usuário já cadastrado!" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  response.json(user).status(201);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);
  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(item => item.id === id) 

  if (!todo) {
    return response.status(404).json({ error: "Todo não existe"})
  }
  
  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(todo)
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(item => item.id === id) 

  if (!todo) {
    return response.status(404).json({ error: "Todo não existe"})
  }
  
  todo.done = true;

  return response.json(todo)
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(item => item.id === id) 

  if (todoIndex === -1) {
    return response.status(404).json({ error: "Todo não existe"})
  }

  user.todo.splice(todoIndex, 1)
  
  return response.status(204).json()
});

module.exports = app;
