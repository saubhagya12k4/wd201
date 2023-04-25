/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
var cheerio = require("cheerio");

const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Responds with json at /todos", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Mark a todo as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Go Gardening",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedTodosResponse.dueToday.length;
    const latestDueTodayTodo = parsedTodosResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const markCompletedResponse = await agent
      .put(`/todos/${latestDueTodayTodo.id}`)
      .send({ _csrf: csrfToken, completed: !latestDueTodayTodo.completed });
    const parsedUpdatedResponse = JSON.parse(markCompletedResponse.text);
    expect(parsedUpdatedResponse.completed).toBe(true);
  });

  test("Deleting a Todo", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "Go Green",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedTodosResponse.dueToday.length;
    const latestDueTodayTodo = parsedTodosResponse.dueToday[dueTodayCount - 1];
    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const deletedResponse = await agent
      .delete(`/todos/${latestDueTodayTodo.id}`)
      .send({ _csrf: csrfToken });
    const parsedDeleteReponse = JSON.parse(deletedResponse.text);

    expect(parsedDeleteReponse).toBe(true);
  });
});
