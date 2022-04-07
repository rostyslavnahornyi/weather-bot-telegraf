import { Markup, Scenes } from "telegraf";
import localization from "../utils/localization.js";
import User from "../models/User.js";
import { fetchData } from "../utils/dataFetching.js";

const forecastScene = (ctx) => {
    const forecast = new Scenes.BaseScene("forecast");

    forecast.enter(async (ctx) => {
        const user = await User.findOne({ chatId: ctx.chat.id });
        ctx.session.lang = user.lang;

        const DATA = await fetchData(user.lang, user.location.coordinates);
        const { current, tomorrow, week } = DATA;

        await ctx.reply(
            current,
            Markup.inlineKeyboard([
                [Markup.button.callback(
                    localization[ctx.session.lang]["forecastButtonTomorrow"],
                    "tomorrow"
                ),
                Markup.button.callback(
                    localization[ctx.session.lang]["forecastButton7Days"],
                    "sevenDays"
                )],
                [Markup.button.callback(
                    localization[ctx.session.lang]["forecastButtonMenu"],
                    "menu"
                )],
            ])
                .oneTime()
                .resize()
        );

        forecast.action("tomorrow", async (ctx) => {
            await ctx.reply(tomorrow);
            await ctx.scene.enter("profile");
            await ctx.deleteMessage(
                ctx.update.callback_query.message.message_id
            );
        });
        forecast.action("sevenDays", async (ctx) => {
            await ctx.reply(week);
            await ctx.scene.enter("profile");
            await ctx.deleteMessage(
                ctx.update.callback_query.message.message_id
            );
        });
    });

    forecast.action("menu", async (ctx) => await ctx.scene.enter("profile"));

    return forecast;
};

export default forecastScene();
