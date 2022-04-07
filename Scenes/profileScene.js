import { Markup, Scenes } from "telegraf";
import localization from "../utils/localization.js";
import User from "../models/User.js";

const profileScene = (ctx) => {
    const profile = new Scenes.BaseScene("profile");

    profile.enter(async (ctx) => {
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
                await ctx.scene.enter("settings");
            }
        );
        profile.hears(
            localization[ctx.session.lang]["profileButtonForecast"],
            async (ctx) => {
                await ctx.scene.enter("forecast");
            }
        );
    });

    return profile;
};

export default profileScene();
