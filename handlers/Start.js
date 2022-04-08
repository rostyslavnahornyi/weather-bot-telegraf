import User from "../models/User.js";
import { scenes } from "../utils/consts.js";
export default async (ctx) => {
    try {
        const chatId = ctx.chat.id;
        const candidate = await User.findOne({ chatId });

        await ctx.reply(`Привіт, ${ctx.chat.first_name}!🐠`);

        if (candidate) {
            await ctx.scene.enter(scenes.REGISTERED);
        } else {
            const { username, first_name } = ctx.chat;
            const user = await new User({
                chatId,
                username: username || null,
                first_name,
            });
            user.save();

            await ctx.replyWithHTML(
                `Давай зараз визначимо, де ти перебуваєш 🗺`
            );
            await ctx.scene.enter(scenes.LOCATION);
        }
    } catch (error) {
        console.log(error);
    }
};
