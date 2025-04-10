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

const dbFilePath = path.join(__dirname, "../db/userData.db");

module.exports = {
    getAll
};

const connectDbWithServer = async () => {
    try {
      db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
      });
    } catch (error) {
      console.log(`Database Connection Failed : ${error.message}`);
    }
  };
  
connectDbWithServer();

async function getAll(req) {
  let currentPage = (req.query.page-1)*req.query.per_page;
  const perPage = req.query.per_page;
  let getAllGadgets = `SELECT *, (SELECT COUNT(*) FROM gadget WHERE status = 'active') AS totalRec FROM gadget WHERE status = 'active' LIMIT ${currentPage}, ${perPage}`;
  let allGadgets = await db.all(getAllGadgets);
  const totalPage = Math.ceil(allGadgets.length / req.query.per_page);
  if (allGadgets === undefined) {
      throw 'No Gadget is available in system';
  } else {
      return {
        "page": req.query.page,
        "per_page": req.query.per_page,
        "total": allGadgets[0].totalRec,
        "total_pages": totalPage,
        "data": allGadgets
    }
  }
}