import { Markup, Scenes } from "telegraf";
import localization from "../utils/localization.js";
import User from "../models/User.js";
import { scenes } from "../utils/consts.js";

const registeredScene = () => {
    const registered = new Scenes.BaseScene(scenes.REGISTERED);

    registered.enter(async (ctx) => {
        try {
            const user = await User.findOne({ chatId: ctx.chat.id });
            ctx.session.lang = user.lang;

            await ctx.reply(
                localization[ctx.session.lang]["registeredMessage"]
            );
            await ctx.reply(
                localization[ctx.session.lang]["registeredQuestion"](
                    user.location.name
                ),
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
                    await ctx.scene
                        .enter(scenes.PROFILE)
                        .catch((error) => console.log(error));
                }
            );
            registered.hears(
                localization[ctx.session.lang]["registeredButtonNo"],
                async (ctx) => {
                    await ctx.scene
                        .enter(scenes.LOCATION)
                        .catch((error) => console.log(error));
                }
            );
        } catch (error) {
            console.log(error);
        }
    });
    return registered;
};

export default registeredScene();
