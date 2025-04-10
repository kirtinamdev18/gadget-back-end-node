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
    getAll,
    saveNew,
    deleteGadget,
    getSingle,
    updateSingle,
    deleteMultiple
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
  let getAllGadgets = `SELECT *, (SELECT COUNT(*) FROM gadget WHERE status = 'active') AS totalRec FROM gadget WHERE status = 'active' ORDER BY id DESC LIMIT ${currentPage}, ${perPage}`;
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

async function getSingle(req) {
  // validate id
  if (!req.params.id){
    errors.push("No id specified");
  }
  let getAllGadgets = `SELECT * FROM gadget WHERE id = ${req.params.id}`;
  let allGadgets = await db.get(getAllGadgets);
  if (allGadgets === undefined) {
      throw 'No Gadget is available with this id in system';
  } else {
      return allGadgets
  }
}

async function saveNew(req) {
  var errors=[]
  // validate title and description
  if (!req.body.title){
      errors.push("No title specified");
  }
  if (!req.body.description){
      errors.push("No description specified");
  }
  var data = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    status: 'active',
    stock: req.body.stock
  }
  var sql ='INSERT INTO gadget (title, description, price, status, stock) VALUES (?,?,?,?,?)'
  var params =[data.title, data.description, data.price, data.status, data.stock]
  let saveGadgetResponse = await db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return {"status": "error", "message": err.message};
      }
      result = {
          "status": "success",
          "message": "Data is saved successfully",
          "data": data,
          "id" : this.lastID
      };
  });
  return saveGadgetResponse;
}

async function updateSingle(req) {
  var errors=[]
  // validate title and description
  if (!req.body.title){
      errors.push("No title specified");
  }
  if (!req.body.description){
      errors.push("No description specified");
  }
  var data = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    status: 'active',
    stock: req.body.stock,
    id: req.body.id
  }
  var sql ='UPDATE gadget SET title = ?, description = ?, price = ?, status = ?, stock = ? WHERE id = ?'
  var params =[data.title, data.description, data.price, data.status, data.stock, data.id]
  let saveGadgetResponse = await db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return {"status": "error", "message": err.message};
      }
      result = {
          "status": "success",
          "message": "Data is saved successfully",
          "data": data,
          "id" : this.lastID
      };
  });
  return saveGadgetResponse;
}

async function deleteGadget(req) {
  var errors=[]
  // validate id
  if (!req.params.id){
      errors.push("No id specified");
  }
  var sql = `DELETE from gadget WHERE id = ${req.params.id}`;
  let saveGadgetResponse = await db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return {"status": "error", "message": err.message};
      }
      result = {
          "status": "success",
          "message": "Data is deleted successfully"
      };
  });
  return saveGadgetResponse;
}

async function deleteMultiple(req) {
  var errors=[]
  // validate id
  if (!req.body.selectedIds){
      errors.push("No id specified");
  }
  const selctedIdsStr = req.body.selectedIds.join(',')
  var sql = `DELETE from gadget WHERE id IN (${selctedIdsStr})`;
  let saveGadgetResponse = await db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return {"status": "error", "message": err.message};
      }
      result = {
          "status": "success",
          "message": "Data is deleted successfully"
      };
  });
  return saveGadgetResponse;
}