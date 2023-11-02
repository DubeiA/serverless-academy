const inquirer = require("inquirer");
const fs = require("fs").promises;

const loadUsers = async () => {
  try {
    const data = await fs.readFile("user_db.txt", "utf-8");
    if (data) {
      const lines = data.trim().split("\n");
      lines.forEach((line) => {
        const user = JSON.parse(line);
        users.push(user);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

loadUsers();

const users = [];

let exit = true;

const questions = [
  {
    type: "input",
    name: "name",
    message: "Enter the user's name. To cancel press ENTER:",
  },
  {
    type: "confirm",
    name: "allUsers",
    message: "Would you to search values in DB?",

    when(answers) {
      return answers.name === "";
    },
  },
  {
    type: "confirm",
    name: "showUser",

    when(answers) {
      return answers.allUsers && console.log(users);
    },
  },
  {
    type: "input",
    name: "findUser",
    message: "Enter user name you wanna find in DB",
    when(answers) {
      return answers.name === "" && answers.allUsers;
    },
  },
  {
    type: "input",
    name: "user",
    when(answers) {
      if (answers.name === "" && answers.allUsers) {
        const userLower = users.find(
          (user) => user.name.toLowerCase() === answers.findUser.toLowerCase()
        );
        if (userLower) {
          console.log(`User ${answers.findUser} was found`);
          console.log(JSON.stringify(userLower));
        } else {
          console.log(`User ${answers.findUser} does not exist`);
        }
      }
      return answers.name === "" && (exit = false);
    },
  },

  {
    type: "list",
    name: "gender",
    message: "Choose your Gender",
    choices: ["Male", "Female"],
    when(answers) {
      return answers.name !== "";
    },
    filter(val) {
      return val.toLowerCase();
    },
  },

  {
    type: "input",
    name: "age",
    message: "Enter your age: ",
    when(answers) {
      return answers.name !== "";
    },
    validate(value) {
      const valid = !isNaN(parseFloat(value));
      return valid || "Please enter a number";
    },
  },
];

const dataBase = () => {
  if (!exit) {
    return;
  }
  inquirer
    .prompt(questions)
    .then((answers) => {
      if (answers.name === "") {
        return;
      }
      users.push(answers);

      const userData = users.map((user) => JSON.stringify(user)).join("\n");
      fs.writeFile("user_db.txt", userData + "\n");
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      dataBase();
    });
};
dataBase();

