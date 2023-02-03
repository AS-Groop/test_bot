require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const {game_options, again_options} = require('./options')

const token = process.env.token;
const bot = new TelegramBot(token, {polling: true});

const chat = {};


async function game(chatId){
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, ф ты должен ее угадать!`);
  const random_number = Math.floor(Math.random() * 10);
  chat[chatId]=random_number;
  return bot.sendMessage(chatId, `Отгадывай!`, game_options)
}

const start = ()=>{
  bot.setMyCommands([
    {command: '/start', description:"Началное приветствие"},
    {command: '/info', description:"Получить информацию о пользователе"},
    {command: '/game', description:"Можно начать игру"}
  ])
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if(msg.text === '/start'){
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/f54/88c/f5488ce1-65b9-4ebb-b3ee-a58ba9284075/192/30.webp')
      return await bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот');
    }
    if(msg.text === '/info'){
      return await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    }
    if(msg.text === '/game'){
      return await game(chatId)
    }

    return await bot.sendMessage(chatId, `Я тебя не понимаю, попробуйте еще раз!`)
  });

  bot.on('callback_query', async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;

    if(data==='/again'){
      return await game(chatId);
    }
    if (+data === chat[chatId]) {
      return await bot.sendMessage(chatId, 'Поздравлаю, ты отгадал цифру '+data, again_options)
    } else {
      return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${data}`, again_options)
    }
  });
}

start();


