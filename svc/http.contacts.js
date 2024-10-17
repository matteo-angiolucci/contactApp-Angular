const express = require("express");
const { json } = require("body-parser");
const { format } = require("prettier");
const { resolve } = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs");

const filePath = resolve("svc", "db.json");
const userFilePath = resolve("svc", "users.json");

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

loadContent = async (path) => {
  if (!existsSync(path)) {
    await saveContent([]);
  }

  const content = readFileSync(path, "utf8");
  return JSON.parse(content);
};

findIndex = (content, id) => {
  return content.findIndex((contact) => `${contact.id}` === `${id}`);
};

findById = (content, id) => {
  return content.find((contact) => `${contact.id}` === `${id}`);
};

findUserByEmail = (content, email) => {
  return content.find((user) => `${user.email}` === `${email}`);
};

parseList = (content) => {
  return content.map(({ id, alias, phoneNo, categoryId }) => ({ id, alias, phoneNo, categoryId }));
};

main = () => {
  const app = express();
  app.use(json());

  // list
  app.get("/api/contacts/list", async (_, res) => {
    const content = await loadContent(filePath);
    const result = parseList(content);
    res.status(200).send(result);
  });

  // get details
  app.get("/api/contacts/:id", async (req, res) => {
    const content = await loadContent(filePath);
    const result = findById(content, req.params.id);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(204).send({ id: req.params.id });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    const content = await loadContent(filePath);
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

    const content = await loadContent(filePath);
    content.push(payload);

    await saveContent(content);

    res.status(200).send(payload);
  });

  // update
  app.patch("/api/contacts", async (req, res) => {
    const payload = req.body;

    const content = await loadContent(filePath);

    const idx = findIndex(content, payload.id);


    if (idx < 0) {
      res.status(204).send(payload);
      return;
    }
    content[idx] = { ...content[idx], ...payload };

    await saveContent(content);

    res.status(200).send(payload);
  });


   // Register a new user
   app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;

    // Load existing users
    const users = await loadContent(userFilePath);

    // Check if email is already registered
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).send({ message: "Email already in use." });
    }

    // Hash the password before saving
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Add new user
    const newUser = { id: `${Math.random()}`.substring(2), email, password };
    users.push(newUser);
    await saveContent(users, userFilePath);

    res.status(201).send({ message: "User registered successfully!" });
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const users = await loadContent(userFilePath);

    const user = await findUserByEmail(users, email);

    if (!user) {
      return res.status(401).send({ message: "User not found with the email provided"});
    }

    try {
      // Ensure both password and user.password (hashed) exist and compare them
      const passwordMatches = (password === user.password);

      if (passwordMatches) {

        const userInfo = {
          email: user.email,
          role: user.role,
          username: user.username
        };
        // Passwords match, login successful
        return res.status(200).send( userInfo );
      } else {
        // Passwords do not match
        return res.status(401).send({ message: "Invalid password!"});
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return res.status(500).send("Server error");
    }
  });


  app.listen(9999, () => console.log("API Server listening on port 9999!"));
};

main();
