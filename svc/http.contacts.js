const express = require("express");
const { json } = require("body-parser");
const { format } = require("prettier");
const { resolve } = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs");

const filePath = resolve("svc", "db.json");

saveContent = async (content) => {
  const formattingOptions = {
    semi: false,
    parser: "json",
    tabWidth: 4,
    singleQuote: true,
    trailingComma: "es5",
  };
  const newContent = await format(JSON.stringify(content), formattingOptions);
  writeFileSync(filePath, newContent, "utf8");
};

loadContent = async () => {
  if (!existsSync(filePath)) {
    await saveContent([]);
  }

  const content = readFileSync(filePath, "utf8");
  return JSON.parse(content);
};

findIndex = (content, id) => {
  return content.findIndex((contact) => `${contact.id}` === `${id}`);
};

findById = (content, id) => {
  return content.find((contact) => `${contact.id}` === `${id}`);
};

parseList = (content) => {
  return content.map(({ id, alias, phoneNo }) => ({ id, alias, phoneNo }));
};

main = () => {
  const app = express();
  app.use(json());

  // list
  app.get("/api/contacts/list", async (_, res) => {
    const content = await loadContent();
    const result = parseList(content);
    res.status(200).send(result);
  });

  // get details
  app.get("/api/contacts/:id", async (req, res) => {
    const content = await loadContent();
    const result = findById(content, req.params.id);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(204).send({ id: req.params.id });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    const content = await loadContent();
    const idx = findIndex(content, req.params.id);

    if (idx < 0) {
      res.status(204).send({ id: req.params.id });
      return;
    }

    content.splice(idx, 1);

    await saveContent(content);
    const result = parseList(content);
    res.status(200).send(result);
  });

  // create
  app.put("/api/contacts", async (req, res) => {
    const payload = req.body;
    payload.id = `${Math.random()}`.substring(2);

    const content = await loadContent();
    content.push(payload);

    await saveContent(content);

    res.status(200).send(payload);
  });

  // update
  app.patch("/api/contacts", async (req, res) => {
    const payload = req.body;

    const content = await loadContent();

    const idx = findIndex(content, payload.id);


    if (idx < 0) {
      res.status(204).send(payload);
      return;
    }
    content = { ...content[idx], ...payload };

    await saveContent(content);

    res.status(200).send(payload);
  });

  app.listen(9999, () => console.log("API Server listening on port 9999!"));
};

main();
