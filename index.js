//data can be broken down with . notation eg data.articlesDATA
const devData = require ("./db/data/development-data");
const testData = require ("./db/data/test-data");
const endpoints = require ("./endpoints.json");
//this for example is the first object in articles.js
// console.log(testData.articleData[0])

module.exports = {devData, testData, endpoints}