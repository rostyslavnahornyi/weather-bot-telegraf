import User from "../models/User.js";
import localization from "../utils/localization.js";

export default async (ctx) => {
    try {
        const user = await User.findOne({ chatId: ctx.chat.id });
        if (user) {
            await ctx.reply(localization[user.lang]["globalErrorMessage"]);
        } else {
            await ctx.reply("/start");
        }
    } catch (error) {
        console.log(error);
    }
};
