
const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Id invalid' })
  }

  return next();
};

app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const data = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(data);

  return res.json(data);
});

app.put("/repositories/:id", validateId, (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repository = repositories.find(repo => repo.id === id);

  if (!repository) {
    return res.status(400).json({ error: 'Repository not found' })
  }

  repository.title = title || repository.title;
  repository.url = url || repository.url;
  repository.techs = techs || repository.techs;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repository = repositories.find(repo => repo.id === id);

  if (!repository) {
    return res.status(400).json({ error: 'Repository not found' })
  }

  repository.likes += 1;
  return res.json(repository);
});

module.exports = app;
