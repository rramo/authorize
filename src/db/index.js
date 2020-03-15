const { DataStore } = require('notarealdb');
 
const store = new DataStore('./src/db/data');
const users = store.collection('users');

module.exports.db = {
  store,
  users
}