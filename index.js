const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let array = [];

const sortValues = (actions) => {
  switch (actions) {
    case "1":
      const byName = array.filter((item) => isNaN(item));
      const sortName = [...byName].sort((a, b) => a.localeCompare(b));
      console.log(sortName);
      sortGame();
      break;
    case "2":
      const numGrowth = array
        .filter((item) => !isNaN(item))
        .sort((a, b) => a - b);
      console.log(numGrowth);
      sortGame();

      break;
    case "3":
      const numDecline = array
        .filter((item) => !isNaN(item))
        .sort((a, b) => b - a);
      console.log(numDecline);

      sortGame();

      break;
    case "4":
      const allWords = array.filter((item) => isNaN(item));
      const lengthSort = allWords.sort((a, b) => a.length - b.length);
      console.log(lengthSort);

      sortGame();

      break;
    case "5":
      //   const lowerCase = array.map((arr) => arr.toLowerCase());
      const allNames = array.filter((item) => isNaN(item));

      const uniqueName = allNames.filter(
        (data, index, array) => array.indexOf(data) === index
      );
      console.log(uniqueName);

      sortGame();

      break;

    case "6":
      const uniqueWords = array.filter(
        (data, index, array) => array.indexOf(data) === index
      );
      console.log(uniqueWords);

      sortGame();

      break;
    case "exit":
      rl.close();
      console.log("Good bye , Come back again");

      break;
    default:
      console.log("somethisng go wrong");
      break;
  }
};

const sortGame = () => {
  rl.question(
    "Hello. Enter 10 words or digits deviding them in spaces or write `exit` and press ENTER:",
    (answer) => {
      if (answer === "exit") {
        sortValues(answer);
        return;
      }
      array = answer.split(" ");
      console.log(
        "How do you like to sort? values:\n" +
          "1. Words by name (from A to Z)\n" +
          "2. Show digits from the smallest to biggest\n" +
          "3. Show digits from the biggest to smallest\n" +
          "4. Show words in ascending order by number of letters in the word\n" +
          "5. Only unique words\n" +
          "6. Only unique values from the set of words and numbers \n" +
          "To finish , write `exit` and press ENTER \n"
      );

      rl.question("SELECT (1 - 6) and press ENTER: ", (answe) => {
        sortValues(answe);
      });
    }
  );
};

sortGame();
