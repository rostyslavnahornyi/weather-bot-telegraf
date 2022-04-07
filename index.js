import { Telegraf, Scenes, session, Markup } from "telegraf";
import localization from "./utils/localization.js";
import User from "./models/User.js";
import mongoose from "mongoose";
import "dotenv/config";

import handlers from "./handlers/index.js";
import scenes from "./Scenes/index.js";
import { Start } from "./utils/scheduler.js";

const bot = new Telegraf(process.env.BOT_TOKEN);

// start cron scheduler for each user
Start();

bot.use(Telegraf.log());
bot.use(session(), new Scenes.Stage(Object.values(scenes)).middleware());

// commands
bot.start(handlers.Start);
bot.command("profile", handlers.Profile);
bot.command("weather", handlers.Weather);
bot.command("settings", handlers.Settings);

// error messages || restart bot
bot.on("message", handlers.Error);

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB successfully connected."))
    .catch((err) => console.log(err));

// start bot
bot.launch()
    .then(() => console.log("Telegram API is working now..."))
    .catch((error) => console.log(error));
