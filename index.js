const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

let jsonData;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function directusRequest(data, query) {
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: process.env.URL + query,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer "+process.env.DIRECTUS_TOKEN,
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}

function readJson(path, callback) {
  fs.readFile(path, "utf8", (err, data) => {
    jsonData = JSON.parse(data);
    callback(jsonData);
  });
}


readJson("./json/collections.json", createCollections);
readJson("./json/fields.json", createFields);
readJson("./json/users.json", createUsers);
readJson("./json/flows.json", createFlows);
readJson("./json/operations.json", createOperations);
readJson("./json/products.json", createProducts);
readJson("./json/users_api.json", cresteUsersAPI);
readJson("./json/webhooks.json", createWebhooks);

async function createCollections(dados) {
    for (var i = 0; i < dados.data.length; i++) {
    directusRequest(dados.data[i], "/collections");
    await delay(500);  }
}

async function createFields(dados) {
   for (var i = 0; i < dados.data.length; i++) {
    directusRequest(dados.data[i], "/fields/" + dados.data[i].collection);
    await delay(500);
  }
}

async function createFlows(dados) {
   for (var i = 0; i < dados.data.length; i++) {
    var userData = dados.data[i]
    delete userData.operations
    directusRequest(dados.data[i], "/flows")
    await delay(500);
  }
}

async function createOperations(dados) {
  for (var i = 0; i < dados.data.length; i++) {
    var userData = dados.data[i];
    delete userData.id;
    delete userData.resolve;
    delete userData.reject;
    directusRequest(dados.data[i], "/operations");
    await delay(500);
  }
}

async function createProducts(dados) {
for (var i = 0; i < dados.data.length; i++) {
  directusRequest(dados.data[i], "/items/Products");
  await delay(500);
}
}

async function createUsers(dados) {
  for (var i = 0; i < dados.data.length; i++) {
    var userData = dados.data[i]
    delete userData.documents
    directusRequest(userData, "/items/Users");
    await delay(500);
  }
}

async function cresteUsersAPI(dados) {
for (var i = 0; i < dados.data.length; i++) {
  directusRequest(dados.data[i], "/items/Users_Api");
  await delay(500);
}
}

async function createWebhooks(dados) {
for (var i = 0; i < dados.data.length; i++) {
  directusRequest(dados.data[i], "/webhooks");
  await delay(500);
}
}