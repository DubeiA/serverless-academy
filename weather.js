const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

axios.defaults.baseURL = "http://api.openweathermap.org/data/2.5";

const api = process.env.API_WEATHER;
const token = process.env.TOKEN_WEATER_BOT;

const bot = new TelegramBot(token, { polling: true });

const fetch = async (city) => {
  try {
    const get = await axios.get(`/forecast?APPID=${api}&units=metric&cnt=1&`, {
      params: { q: city },
    });

    return get.data;
  } catch (error) {
    console.log(error);
  }
};

//https://t.me/ServerlessWeatherBot

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    keyboard: [[{ text: "Forecast in Nice" }]],
    resize_keyboard: true,
  };

  bot.sendMessage(chatId, "Hello", {
    reply_markup: keyboard,
  });
});

bot.onText(/Forecast in Nice/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    keyboard: [
      [{ text: "at intervals of 3 hours" }],
      [{ text: "at intervals of 6 hours" }],
    ],
    resize_keyboard: true,
  };

  bot.sendMessage(chatId, "Choose interval", {
    reply_markup: keyboard,
  });
});

bot.onText(/at intervals of 3 hours/, (msg) => {
  getWeatherForecast(msg.chat.id, 3);
});

bot.onText(/at intervals of 6 hours/, (msg) => {
  getWeatherForecast(msg.chat.id, 6);
});

async function getWeatherForecast(chatId, interval) {
  const forcast = await fetch("Nice");

  const [list] = forcast.list.map((weather) => weather);

  bot.sendMessage(
    chatId,

    `
         temperature: ${list.main.temp}°C,
         clouds: ${list.clouds.all} %
         sky: ${list.weather[0].description},
         humidity: ${list.main.humidity}%,
         wind: ${list.wind.speed}m/s,
         `
  );
  if (interval === 3) {
    setInterval(async () => {
      const forcast = await fetch("Nice");

      const [list] = forcast.list.map((weather) => weather);

      bot.sendMessage(
        chatId,

        `
         temperature: ${list.main.temp} C,
         clouds: ${list.clouds.all} %
         sky: ${list.weather[0].description},
         humidity: ${list.main.humidity}%,
         wind: ${list.wind.speed}m/s,
         `
      );
    }, 1000 * 60 * 60 * interval);
  }

  if (interval === 6) {
    setInterval(async () => {
      const forcast = await fetch("Nice");

      const [list] = forcast.list.map((weather) => weather);

      bot.sendMessage(
        chatId,

        `
         temperature: ${list.main.temp} C,
         clouds: ${list.clouds.all} %
         sky: ${list.weather[0].description},
         humidity: ${list.main.humidity}%,
         wind: ${list.wind.speed}m/s,
         `
      );
    }, 1000 * 60 * 60 * interval);
  }
}
