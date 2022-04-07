import { Markup, Scenes } from "telegraf";
import localization from "../utils/localization.js";
import User from "../models/User.js";

const registeredScene = (ctx) => {
    const registered = new Scenes.BaseScene("registered");

    registered.enter(async (ctx) => {
        const user = await User.findOne({ chatId: ctx.chat.id });
        ctx.session.lang = user.lang;

        await ctx.reply(localization[ctx.session.lang]["registeredMessage"]);
        await ctx.reply(
            localization[ctx.session.lang]["registeredQuestion"](user.location.name),
            Markup.keyboard([
                localization[ctx.session.lang]["registeredButtonYes"],
                localization[ctx.session.lang]["registeredButtonNo"],
            ])
                .oneTime()
                .resize()
        );

        registered.hears(
            localization[ctx.session.lang]["registeredButtonYes"],
            async (ctx) => {
                
                await ctx.scene.enter("profile");
            }
        );
        registered.hears(
            localization[ctx.session.lang]["registeredButtonNo"],
            async (ctx) => {
                
                await ctx.scene.enter("location");
            }
        );
    });
    return registered;
};

export default registeredScene();
