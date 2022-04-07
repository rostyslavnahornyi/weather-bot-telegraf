import { Telegraf } from "telegraf";
import schedule from "node-schedule";
import "dotenv/config";

import User from "../models/User.js";
import { fetchData } from "./dataFetching.js";
import localization from "./localization.js";

const bot = new Telegraf(process.env.BOT_TOKEN);

export async function Start() {
    const users = await User.find({});

    users.forEach(({ chatId, notifications, lang, location }) => {
        if (notifications.status) {
            schedule.scheduleJob(
                chatId.toString(),
                notifications.rule,
                async () => {
                    const weather = await fetchData(lang, location.coordinates);
                    bot.telegram.sendMessage(
                        chatId,
                        weather.current +
                            localization[lang]["globalSheduleInfo"]
                    );
                }
            );
        }
    });
    console.log(schedule.scheduledJobs);
}

export async function StopAll() {
    const users = await User.find({});

    users.forEach(({ chatId }) => {
        schedule.cancelJob(chatId.toString());
    });
}
