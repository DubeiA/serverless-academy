const fs = require("fs").promises;
const path = require("path");

const vacationPath = path.join(__dirname, "/vacation.json");

const changeJson = async () => {
  const data = await fs.readFile(vacationPath);

  const newJson = {};

  JSON.parse(data).forEach((item) => {
    const userId = item.user._id;
    const userName = item.user.name;
    const vacation = {
      startDate: item.startDate,
      endDate: item.endDate,
    };

    if (!newJson[userId]) {
      newJson[userId] = {
        userId: userId,
        userName: userName,
        vacations: [],
      };
    }

    newJson[userId].vacations.push(vacation);
  });

  const json = Object.values(newJson);

  return console.log(JSON.stringify(json, null, 2));
};

changeJson();
