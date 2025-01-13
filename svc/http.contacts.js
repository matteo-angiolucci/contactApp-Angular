const express = require("express");
const { json } = require("body-parser");
const { format } = require("prettier");
const { resolve } = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs");
const fs = require('fs');
const path = require('path');  // <-- Add this line to import the path module

const contactsDB = resolve("svc", "db.json");
const usersDB = resolve("svc", "users.json");
const productDb = resolve("svc", "data.json")
const translationsFolder = path.join(__dirname, 'translations');

saveContent = async (content,path) => {
  const formattingOptions = {
    semi: false,
    parser: "json",
    tabWidth: 4,
    singleQuote: true,
    trailingComma: "es5",
  };
  const newContent = await format(JSON.stringify(content), formattingOptions);
  writeFileSync(path, newContent, "utf8");
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


parseListUsers = (content) => {
  return content.map(({ id, email, password, role , active }) => ({ id, email, password, role, active }));
};

parseListProducts = (content) =>{
  return content.map(({ image, name, category, price, id  }) => ({ image, name, category, price , id }));
}

main = () => {
  const app = express();
  app.use(json());

  // get contacts List
  app.get("/api/contacts/list", async (_, res) => {
    const content = await loadContent(contactsDB);
    const result = parseList(content);
    res.status(200).send(result);
  });

  // get details
  app.get("/api/contacts/:id", async (req, res) => {
    const content = await loadContent(contactsDB);
    const result = findById(content, req.params.id);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(204).send({ id: req.params.id });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    const content = await loadContent(contactsDB);
    const idx = findIndex(content, req.params.id);

    if (idx < 0) {
      res.status(204).send({ id: req.params.id });
      return;
    }

    content.splice(idx, 1);

    await saveContent(content, contactsDB);
    const result = parseList(content);
    res.status(200).send(result);
  });

  // create
  app.put("/api/contacts", async (req, res) => {
    const payload = req.body;
    payload.id = `${Math.random()}`.substring(2);

    const content = await loadContent(contactsDB);
    content.push(payload);

    await saveContent(content, contactsDB);

    res.status(200).send(payload);
  });

  // update
  app.patch("/api/contacts", async (req, res) => {
    const payload = req.body;

    const content = await loadContent(contactsDB);

    const idx = findIndex(content, payload.id);


    if (idx < 0) {
      res.status(204).send(payload);
      return;
    }
    content[idx] = { ...content[idx], ...payload };

    await saveContent(content, contactsDB);

    res.status(200).send(content);
  });


   // Register a new user
   app.post("/api/register", async (req, res) => {
    const { email, password , name , role , lastName , dateOfBirth } = req.body;

    debugger
    // Load existing users
    const users = await loadContent(usersDB);

    // Check if email is already registered
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).send({ message: "Email already in use." });
    }


    // Add new user
    const newUser = { id: `${Math.random()}`.substring(2), email, password, name, role, lastName, dateOfBirth};
    users.push(newUser);
    await saveContent(users, usersDB);

    res.status(201).send({ message: "User registered successfully!" });
  });

  // login
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const users = await loadContent(usersDB);


    const user = await findUserByEmail(users, email);


    if (!user) {
      return res.status(401).send({ message: "User not found with the email provided"});
    }

    if(user.active === false){
      return res.status(401).send({ message: "User not active contact an Admin to activate the account"});
    }

    try {
      // Ensure both password and user.password (hashed) exist and compare them
      const passwordMatches = (password === user.password);

      if (passwordMatches) {

        const userInfo = {
          email: user.email,
          role: user.role,
          name: user.name
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

    // get contacts List
    app.get("/api/users/list", async (_, res) => {
      const content = await loadContent(usersDB);
      const result = parseListUsers(content);
      res.status(200).send(result);
    });


   // middlefunction to check if the user is an admin
const isAdmin = (req, res, next) => {
  const user = req.body.loggedUser;
  //console.log('[REQ-BODY' , req.body);
  //console.log('[ADMIN-FUNCTION CHECK] ==> ' , user);

  // Check if the user exists and has the role of 'ADMIN'
  if (user && user.role === 'Admin') {
      next(); // Proceed to the next route handler
  } else {
      res.status(403).send({ message: "Operation denied. Admins only." }); // Send forbidden status
  }
};



  // update a user active or non active
  app.patch("/api/users/activeDeactive", isAdmin ,async (req, res) => {
    const {loggedUser, user , active } = req.body;

    const payload = req.user;
    //console.log('PAYLOAD:' , payload);

    const content = await loadContent(usersDB);

    const idx = findIndex(content, user.id);

    if (idx < 0) {
      res.status(204).send(payload);
      return;
    }

    content[idx] = { ...content[idx], active: active };

    await saveContent(content, usersDB);

    //const contentFilter = content.filter(user => user.email !== loggedUser?.email)

    res.status(200).send(content[idx]);
  });


    // change users Password
    app.patch(`/api/users/changePassword`, isAdmin ,async (req, res) => {
      const { user , newPassword } = req.body;

      //const payload = user;

      const content = await loadContent(usersDB);

      const idx = findIndex(content, user.id);

      if (idx < 0) {
        res.status(204).send(user);
        return;
      }


      if(content[idx].password === newPassword ){
        res.status(409).send({ outputmessage: "Password is the same as the old one! Change the New password to something different"});
      }

      content[idx] = { ...content[idx], password: newPassword };

      await saveContent(content, usersDB);

      res.status(200).send({ outputmessage: "Password updated successfully" , user: content[idx] } );
    });


    // get Products List
  app.get("/api/products/list", async (_, res) => {
    const content = await loadContent(productDb);
    const result = parseListProducts(content);
    res.status(200).send(result);
  });

// GET translations by language
app.get('/api/translations/:lang', (req, res) => {
  const lang = req.params.lang;

  //console.log('LANG', lang)
  // Path to the requested translation file
  const translationFilePath = path.join(translationsFolder, `${lang}.json`);
  //console.log('translationFilePath', translationFilePath);

  // Check if the file exists
  fs.readFile(translationFilePath, 'utf8', (err, data) => {
    if (err) {
      // If file not found or another error occurred
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Language not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Parse and send the translation file
    try {
      const translations = JSON.parse(data);
      res.json(translations);
    } catch (parseError) {
      res.status(500).json({ error: 'Invalid JSON in translation file' });
    }
  });
});


  app.listen(9999, () => console.log("API Server listening on port 9999!"));
};

main();
