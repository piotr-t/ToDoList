const fs = require("fs");
const argum = require("yargs").argv;
const inquirer = require("inquirer"); // console option
const chalk = require("chalk"); //console style
const _ = require("lodash");
let { list, del, add, validateRecord } = require("./listModule");
const { delListRecordAxios, postList, respList } = require("./sendListModule");

let reeatLine = _.repeat("-", 120);
let listCategory = [];


//////////////////////głowny komponent/////////////////////////
let headToDo = () => {
  /////////////////////////// header/////////////////////////////
  console.log(chalk.green.bold.underline("      ToDo aplication       \n"));
  console.log("\n");

  /////////////////////first list//////////////////////////////////////
  inquirer
    .prompt([
      {
        type: "list",
        name: "wyb",
        message: chalk.whiteBright.bgBlackBright.italic(
          " wybierz co chcesz zrobić: \n \n"
        ),
        default: 0,
        choices: [
          new inquirer.Separator("                       "),
          "wyswietl listę zadań",
          new inquirer.Separator("--------------------- \n"),
          "dodaj zadanie",
          "usuń zadanie",
          new inquirer.Separator("---------------------"),
          "zmień status",
          "filtruj",
          "sortuj według",
          "grupuj",
          new inquirer.Separator("---------------------"),
          "wyślij dane",
          "pobierz dane",
          new inquirer.Separator(),
          "wyjście",
          new inquirer.Separator(),
          new inquirer.Separator("                       ")
        ]
      }
    ])
    .then(({ wyb }) => {
      switch (wyb) {
        case "wyswietl listę zadań":
          {
            console.clear();
            listaZadan(list);
            headToDo();
          }
          break;
        case "dodaj zadanie":
          {
            add(headToDo, listaZadan);



          }
          break;
        case "usuń zadanie":
          {
            del(headToDo, listaZadan);

          }
          break;
        case "zmień status":
          {
            zmianaStatusu(list);
          }
          break;
        case "sortuj według":
          {
            sortt();

          }
          break;
        case "filtruj":
          {
            filterList();

          }
          break;
        case "grupuj":
          {
            groupList();

          }
          break;
        case "wyślij dane":
          {


            postList(list).then(res => {
              console.log("dane wysłane");
              listaZadan(list);
              headToDo();
            }).catch(err => {
              console.log(
                chalk.red(`\n\n${err},\n`, "Dane nie mogą być wysłane")
              );
            });;
          }
          break;
        case "pobierz dane":
          {
            respList()
              .then(({ data }) => {
                console.log("dane pobrane");
                list = _.unionWith(list, data, _.isEqual);


                listaZadan(list);
                headToDo();
              })
              .catch(err => {
                console.log(
                  chalk.red(`\n\n${err},\n`, "Brak zasobu, wprowadz dane")
                );
              });
          }
          break;
        case "wyjście":
          {
            console.clear();
          }
          break;
      }
    });
};

let listaZadan = list => {
  console.clear();
  /////////////// list header /////////////////
  console.log("\n", chalk.whiteBright.underline(" ToDo List  "), "\n");
  console.log("(id, task, status, category, date) \n");
  ////////////////list body/////////////////////
  console.log(`${reeatLine}`);
  list.forEach((item, id) => {
    item.date = item.date ? item.date : "";
    let id2 = id + 1;
    id2 = _.pad(id2, 5);
    let inl = Math.floor(item.name.length / 45) + 1;
    let itemN = _.padEnd(item.name, 45);
    let itemS = item.status ? "zrobione" : "niezrobione";
    itemS = _.pad(itemS, 15);
    let itemD = _.pad(item.date, 20);
    let itemC = _.pad(item.category, 25);
    if (inl > 1) {
      for (i = 0; i < inl; i++) {
        let len70 = itemN.substr(0, 45);
        console.log(`|${id2}|   ${len70}|${itemS}|${itemC}|${itemD}|`);
        id2 = _.pad("", 5);
        itemS = _.pad("", 15);
        itemN = itemN.slice(45);
        itemN = _.padEnd(itemN, 45);
        itemD = _.pad("", 20);
        itemC = _.pad('', 25);

      }
    } else {
      console.log(`|${id2}|   ${itemN}|${itemS}|${itemC}|${itemD}|`);
    }
    console.log(`${reeatLine}`);
  });
  console.log("\n");
};

let zmianaStatusu = (list) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "toggleStatus",
        message: "Wprowadz zadanie:",
        validate: validateRecord
      }
    ])
    .then(

      ({ toggleStatus }) => {
        list[toggleStatus - 1].status = !list[toggleStatus - 1].status;
        console.clear();

        fs.writeFile("todoList.json", JSON.stringify(list), () => {

          listaZadan(list);
          headToDo();

        });
      }
    );
};

let filterList = () => {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "filtrListValue",
        message: "Wprowadz zadanie:",
        default: 0,
        choices: ["wszystkie", "aktywne", "kompletne"]
      }
    ])
    .then(({ filtrListValue }) => {
      filterListSwitch(filtrListValue);
    });
};

let filterListSwitch = val => {
  switch (val) {
    case "wszystkie":
      {

        listaZadan(list);
        headToDo()
      }
      break;
    case "aktywne":
      console.clear();
      {
        let list2 = list.filter(({ status }, id) => status === false);
        listaZadan(list2);
        headToDo()
      }
      break;
    case "kompletne":
      console.clear();
      {
        let list3 = list.filter(({ status }, id) => status === true);
        listaZadan(list3);
        headToDo()
      }
      break;
  }
};
let sortt = () => {
  listCategory = _.uniqBy(list, 'category');
  listCategory = listCategory.map(itemCategory => itemCategory.category);

  inquirer
    .prompt([
      {
        type: "list",
        name: "filtrListValue",
        message: "Wprowadz zadanie:",
        default: 0,
        choices: listCategory
      }]).then(
        ({ filtrListValue }) => {
          let listS = list.filter(({ category }) => category === filtrListValue);
          listaZadan(listS);
          headToDo();
        }

      )

}
let groupList = () => {
  let listCategoryy = _.uniqBy(list, 'category');
  listCategoryy = listCategoryy.map(itemCategory => itemCategory.category);
  listCategoryy.push('dodaj nową kategorię');

  inquirer
    .prompt([
      {
        type: "input",
        name: "ChangeCategory",
        message: "Wprowadz rekord do zmiany grupy:",
        validate: validateRecord
      }
    ]).then(({ ChangeCategory }) => {

      ChangeCategory = ChangeCategory - 1;
      zmmmCategory(ChangeCategory, listCategoryy);
    }

    )
};

let zmmmCategory = (ChangeCategory, listCategoryy) => {
  console.clear();

  inquirer
    .prompt([
      {
        type: "list",
        name: "lCategory",
        message: "Wybierz grupę:",
        default: 0,
        choices: listCategoryy
      }
    ]).then(({ lCategory }) => {
      if (lCategory == "dodaj nową kategorię") {
        // console.clear();
        inquirer
          .prompt([
            {
              type: "input",
              name: "ChangeCategory2",
              message: "Wprowadz nazwę grupy:",
            }
          ]).then(({ ChangeCategory2 }) => {
            list[ChangeCategory].category = ChangeCategory2;
            fs.writeFile("todoList.json", JSON.stringify(list), () => {
              // headToDo();
            });
          })
      }
      else {
        list[ChangeCategory].category = lCategory;
        fs.writeFile("todoList.json", JSON.stringify(list), () => {
          // headToDo();
        });
        listaZadan(list)
      }

    })
}

console.clear();
headToDo();
