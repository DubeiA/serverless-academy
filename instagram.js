const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "users");

const readAll = async () => {
  try {
    const files = await fs.readdir(contactsPath);
    const fileContents = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(contactsPath, filename);

        return await fs.readFile(filePath, "utf-8");
      })
    );

    return fileContents.join("").split("\n");
  } catch (error) {
    console.error(error);
  }
};

const readByOne = async (filePath) => {
  const content = await fs.readFile(filePath, "utf-8");
  return content.split("\n");
};

const uniqueValues = async () => {
  console.time("UniqueUser");

  const users = await readAll();

  const set = new Set(users);

  console.log(set.size);
  console.timeEnd("UniqueUser");

  return set;
};

const existInAllFiles = async () => {
  console.time("filterUser");
  const userSets = [];

  for (let i = 0; i < 20; i++) {
    const users = await readByOne(`./users/out${i}.txt`);
    const userSet = new Set(users);
    userSets.push(userSet);
  }

  const namesSet = userSets.reduce((result, currentSet) => {
    const set = new Set();
    for (const name of currentSet) {
      if (result.has(name)) {
        set.add(name);
      }
    }
    return set;
  }, userSets[0]);

  console.log(namesSet.size);
  console.timeEnd("filterUser");
};

const existInAtleastTen = async () => {
  console.time("filterUserTen");
  const userSets = [];

  for (let i = 0; i < 20; i++) {
    const users = await readByOne(`./users/out${i}.txt`);
    const userSet = new Set(users);
    userSets.push(userSet);
  }

  const nameCounts = {};

  for (const userSet of userSets) {
    for (const name of userSet) {
      nameCounts[name] = (nameCounts[name] || 0) + 1;
    }
  }

  const commonNames = Object.keys(nameCounts).filter(
    (name) => nameCounts[name] >= 10
  );

  console.log(commonNames.length);
  console.timeEnd("filterUserTen");
};

uniqueValues();
existInAllFiles();
existInAtleastTen();
