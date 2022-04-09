import { Telegraf } from "telegraf";
import schedule from "node-schedule";
import "dotenv/config";

import User from "../models/User.js";
import { fetchData } from "./dataFetching.js";
import localization from "./localization.js";

const bot = new Telegraf(process.env.BOT_TOKEN);

export async function Start() {
    try {
        const users = await User.find({}).catch((error) => console.log(error));

        users.forEach(({ chatId, notifications, lang, location }) => {
            if (location.name && notifications.status) {
                schedule.scheduleJob(
                    chatId.toString(),
                    notifications.rule,
                    async () => {
                        try {
                            const weather = await fetchData(
                                lang,
                                location.coordinates
                            );
                            bot.telegram.sendMessage(
                                chatId,
                                weather.current +
                                    localization[lang]["globalSheduleInfo"]
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }
                );
            };
        });
        Object.values(schedule.scheduledJobs).forEach(job => console.log(job.name));
    } catch (error) {
        console.log(error);
    }
}

export async function StopAll() {
    try {
        const users = await User.find({}).catch((error) => console.log(error));

        users.forEach(({ chatId }) => {
            schedule.cancelJob(chatId.toString());
        });
    } catch (error) {
        console.log(error);
    }
}
