const express = require("express");
const app = express();
const db = require("./models/index");
var csrf = require("tiny-csrf");
const bodyParser = require("body-parser");
const path = require("path");
var cookieParser = require("cookie-parser");

// const { Todos } = require("./models");
// eslint-disable-next-line no-unused-vars
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  try {
    const allTodos = await db.Todos.getTodos();
    const overdue = await db.Todos.overdue();
    const dueLater = await db.Todos.dueLater();
    const dueToday = await db.Todos.dueToday();
    const completed = await db.Todos.completed();
    if (request.accepts("html")) {
      response.render("index", {
        title: "Todo Application",
        allTodos,
        overdue,
        dueLater,
        dueToday,
        completed,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({ overdue, dueLater, dueToday, completed });
    }  
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos", async (request, response) => {
  // defining route to displaying message
  console.log("Todo list");
  try {
    const todoslist = await db.Todos.findAll();
    return response.json(todoslist);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("creating new todo", request.body);
  try {
    // eslint-disable-next-line no-unused-vars
    await db.Todos.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      commpleted: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
//PUT https://mytodoapp.com/todos/123/markAscomplete
app.put("/todos/:id", async (request, response) => {
  console.log("Mark Todo as completed:", request.params.id);
  const todo = await db.Todos.findByPk(request.params.id);
  try {
    const updatedtodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedtodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.delete("/todos/:id", async (request, response) => {
  console.log("delete a todo with ID:", request.params.id);
  try {
    await db.Todos.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
  }
});
module.exports = app;
