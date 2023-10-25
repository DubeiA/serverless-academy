const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;

process.env["NTBA_FIX_350"] = 1;
const fs = require("fs");
const { program } = require("commander");

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(token, { polling: false });

program
  .command("send-message <message>")
  .alias("m")
  .description("Send message to Telegram Bot")
  .action((message) => {
    bot.sendMessage(chatId, message);
  });

program
  .command("send-photo <path>")
  .alias("p")
  .description(
    "Send a photo to telegram Bot. Just drag and drop it console after p-flag"
  )
  .action((path) => {
    if (fs.existsSync(path)) {
      const photo = fs.createReadStream(path);

      bot
        .sendPhoto(chatId, photo)
        .then(() => {
          console.log("You successfull send photo to ypu bot.");
        })
        .catch((error) => {
          console.error("Error sending photo:", error);
        });
    } else {
      console.error("File not found:", path);
    }
  });

program.parse(process.argv);

// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;

// });
