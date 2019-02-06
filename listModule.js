const inquirer = require("inquirer");
const fs = require("fs");
const { delListRecordAxios, postList, respList } = require("./sendListModule");

let objAdd = { name: "", status: "" };
let list = [];
list = JSON.parse(fs.readFileSync("todoList.json", "utf8"));

let validateRecord = delRecord => {
  return (
    (Number.isInteger(parseFloat(delRecord)) &&
      delRecord > 0 &&
      delRecord <= list.length) ||
    "wprowadz liczbę całokowitą z zakresu listy"
  );
};

let add = (headToDo, listaZadan) => {
  console.clear();
  inquirer
    .prompt([
      {
        type: "input",
        name: "addRecord",
        message: "Wprowadz zadanie:",
        validate: name => name !== ''
      },
      {
        type: "input",
        name: "addCategory",
        message: "Wprowadz kategorię:"
      }
    ])
    .then(({ addRecord, addCategory }) => {
      objAdd.name = addRecord;
      objAdd.category = addCategory;
      objAdd.status = false;
      objAdd.date = new Date().toLocaleString();

      list.push(Object.assign({}, objAdd));
      fs.writeFile("todoList.json", JSON.stringify(list), () => {

        listaZadan(list);
        headToDo();

      });
    });
};

let del = (headToDo, listaZadan) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "delRecord",
        message: "Wprowad rekord do usunięcia:",
        validate: validateRecord
      }
    ])
    .then(({ delRecord }) => {
      list.splice(delRecord - 1, 1);
      fs.writeFile("todoList.json", JSON.stringify(list), ds => {
        listaZadan(list);
        headToDo();
      });

    });
};

module.exports = {
  validateRecord: validateRecord,
  list: list,
  del: del,
  add: add
};
