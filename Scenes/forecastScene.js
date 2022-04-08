import { Markup, Scenes } from "telegraf";
import User from "../models/User.js";
import { fetchData } from "../utils/dataFetching.js";
import localization from "../utils/localization.js";
import { scenes } from "../utils/consts.js";

const forecastScene = () => {
    const forecast = new Scenes.BaseScene(scenes.FORECAST);

    forecast.enter(async (ctx) => {
        const user = await User.findOne({ chatId: ctx.chat.id });
        ctx.session.lang = user.lang;

        const DATA = await fetchData(user.lang, user.location.coordinates);
        const { current, tomorrow, week } = DATA;

        await ctx.reply(
            current,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        localization[ctx.session.lang][
                            "forecastButtonTomorrow"
                        ],
                        "tomorrow"
                    ),
                    Markup.button.callback(
                        localization[ctx.session.lang]["forecastButton7Days"],
                        "sevenDays"
                    ),
                ],
                [
                    Markup.button.callback(
                        localization[ctx.session.lang]["forecastButtonMenu"],
                        "menu"
                    ),
                ],
            ])
                .oneTime()
                .resize()
        );

        forecast.action("tomorrow", async (ctx) => {
            const reply = ctx.reply(tomorrow);
            const scene = ctx.scene.enter(scenes.PROFILE);
            const del = ctx.deleteMessage(
                ctx.update.callback_query.message.message_id
            );

            Promise.all([reply, scene, del], (error) => console.log(error));
        });
        forecast.action("sevenDays", async (ctx) => {
            const reply = ctx.reply(week);
            const scene = ctx.scene.enter(scenes.PROFILE);
            const del = ctx.deleteMessage(
                ctx.update.callback_query.message.message_id
            );

            Promise.all([reply, scene, del], (error) => console.log(error));
        });
    });

    forecast.action("menu", async (ctx) => {
        await ctx.scene.enter(scenes.PROFILE).catch((error) => console.log(error));
    });

    return forecast;
};

export default forecastScene();
