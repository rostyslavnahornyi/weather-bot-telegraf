import { Markup, Scenes } from "telegraf";
import localization from "../utils/localization.js";
import User from "../models/User.js";
import { scenes } from "../utils/consts.js";

const profileScene = () => {
    const profile = new Scenes.BaseScene(scenes.PROFILE);

    profile.enter(async (ctx) => {
        try {
            const user = await User.findOne({ chatId: ctx.chat.id });
            ctx.session.lang = user.lang;

            await ctx.reply(
                localization[ctx.session.lang]["profileQuestion"],
                Markup.keyboard([
                    localization[ctx.session.lang]["profileButtonSettings"],
                    localization[ctx.session.lang]["profileButtonForecast"],
                ])
                    .oneTime()
                    .resize()
            );

            profile.hears(
                localization[ctx.session.lang]["profileButtonSettings"],
                async (ctx) => {
                    await ctx.scene
                        .enter(scenes.SETTINGS)
                        .catch((error) => console.log(error));
                }
            );
            profile.hears(
                localization[ctx.session.lang]["profileButtonForecast"],
                async (ctx) => {
                    await ctx.scene
                        .enter(scenes.FORECAST)
                        .catch((error) => console.log(error));
                }
            );
        } catch (error) {
            console.log(error);
        }
    });

    return profile;
};

export default profileScene();
