const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const NodeCache = require("node-cache");

axios.defaults.baseURL = "http://api.openweathermap.org/data/2.5";

const api = process.env.API_WEATHER;
const token = process.env.TOKEN_WEATER_BOT;
const apiPrivatBank =
  "https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5";

const bot = new TelegramBot(token, { polling: true });
const myCache = new NodeCache();

let city = "Lviv";
let intervalTimer;

const fetch = async (city) => {
  const cache = myCache.get(city);

  if (cache) {
    return cache;
  }

  try {
    const { data } = await axios.get(
      `/forecast?APPID=${api}&units=metric&cnt=1&`,
      {
        params: { q: city },
      }
    );
    myCache.set(city, data, 900);

    return data;
  } catch (error) {
    console.log(error);
  }
};

//https://t.me/ServerlessWeatherBot

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    keyboard: [[{ text: "Weather" }], [{ text: "Exchange" }]],
    resize_keyboard: true,
  };

  bot.sendMessage(chatId, "Hello", {
    reply_markup: keyboard,
  });
});

bot.onText(/Exchange/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    keyboard: [["USD", "EUR"], [{ text: "Go back" }]],
    resize_keyboard: true,
  };

  bot.sendMessage(chatId, "Choose currency", {
    reply_markup: keyboard,
  });
});

bot.onText(/USD/, async (msg) => {
  const chatId = msg.chat.id;
  const { data } = await axios.get(apiPrivatBank);

  const buyCash = data[1].buy;
  const saleCash = data[1].sale;

  const message = `${data[1].ccy}\n  buy: ${Number(buyCash).toFixed(
    2
  )}\n  sale: ${Number(saleCash).toFixed(2)}`;
  const keyboard = {
    keyboard: [[{ text: "Go back" }]],
    resize_keyboard: true,
  };

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard,
  });
});

bot.onText(/EUR/, async (msg) => {
  const chatId = msg.chat.id;
  const { data } = await axios.get(apiPrivatBank);

  const buyCash = data[0].buy;
  const saleCash = data[0].sale;

  const message = `${data[0].ccy}\n  buy: ${Number(buyCash).toFixed(
    2
  )}\n  sale: ${Number(saleCash).toFixed(2)}`;
  const keyboard = {
    keyboard: [[{ text: "Go back" }]],
    resize_keyboard: true,
  };

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard,
  });
});

bot.onText(/Weather/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    keyboard: [["Nice", "Lviv", "Kyiv"]],
    resize_keyboard: true,
  };

  bot.sendMessage(chatId, "Choose city:", { reply_markup: keyboard });
});

bot.onText(/^(Nice|Lviv|Kyiv)$/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    keyboard: [
      ["Every 3 hours", "Every 6 hours"],
      [{ text: "Wind" }],
      [{ text: "Go back" }],
    ],
    resize_keyboard: true,
  };

  bot.sendMessage(chatId, "Choose interval", {
    reply_markup: keyboard,
  });

  return (city = msg.text);
});

bot.onText(/Every 3 hours/, (msg) => {
  clearInterval(intervalTimer);
  getWeatherForecast(msg.chat.id, 3);
});

bot.onText(/Every 6 hours/, (msg) => {
  clearInterval(intervalTimer);
  getWeatherForecast(msg.chat.id, 6);
});

bot.onText(/Wind/, (msg) => {
  getWind(msg.chat.id);
});

bot.onText(/Go back/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    keyboard: [[{ text: "Weather" }], [{ text: "Exchange" }]],
    resize_keyboard: true,
  };

  bot.sendMessage(chatId, "Choose option", {
    reply_markup: keyboard,
  });
});

async function getWind(chatId) {
  const forcast = await fetch(city);

  bot.sendMessage(chatId, `wind: ${forcast.list[0].wind.speed}m/s,`);
}

async function getWeatherForecast(chatId, interval) {
  const forcast = await fetch(city);

  const [list] = forcast.list.map((weather) => weather);

  bot.sendMessage(
    chatId,

    `
         temperature: ${list.main.temp}°C,
         clouds: ${list.clouds.all} %
         sky: ${list.weather[0].description},
         humidity: ${list.main.humidity}%,
         
         `
  );
  intervalTimer = setInterval(async () => {
    const forcast = await fetch(city);

    const [list] = forcast.list.map((weather) => weather);

    bot.sendMessage(
      chatId,

      ` temperature: ${list.main.temp} C,
         clouds: ${list.clouds.all} %
         sky: ${list.weather[0].description},
         humidity: ${list.main.humidity}%,
        `
    );
  }, 1000 * interval);
}
