const express = require("express");
const config = require('config.json');
const jwt = require('jsonwebtoken');
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
app.use(express.json());
let db = null;
const port = 3000;

// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

const dbFilePath = path.join(__dirname, "../db/userData.db");

module.exports = {
    authenticate,
    getAll
};

const connectDbWithServer = async () => {
    try {
      db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
      });
      app.listen(port, () => {
        console.log(`Sqlite Server Started..!`);
      });
    } catch (error) {
      console.log(`Database Connection Failed : ${error.message}`);
    }
  };
  
connectDbWithServer();

async function authenticate({ username, password }) {
    let getUserDetails = `SELECT * FROM user WHERE username = '${username}'`;
    let checkInDb = await db.get(getUserDetails);
    if (checkInDb === undefined) {
        throw 'Username or password is incorrect';
    } else {
        const isPasswordMatched = await bcrypt.compare(
        password,
        checkInDb.password
        );

        if (isPasswordMatched) {
            const token = jwt.sign({ sub: checkInDb.id }, config.secret, { expiresIn: '7d' });
        
            return {
                ...omitPassword(checkInDb),
                token
            };
        } else {
        throw 'Username or password is incorrect';
        }
    }
}

async function getAll() {
    return users.map(u => omitPassword(u));
}

// helper functions

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}