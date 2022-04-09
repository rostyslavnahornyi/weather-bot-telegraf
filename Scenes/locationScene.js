import { Markup, Scenes } from "telegraf";
import { directGeocode } from "../utils/geocoder.js";
import localization from "../utils/localization.js";
import User from "../models/User.js";
import fs from "fs";
import { scenes } from "../utils/consts.js";
import { Restart } from "../utils/scheduler.js";

const locationScene = () => {
    const location = new Scenes.BaseScene(scenes.LOCATION);

    location.enter(async (ctx) => {
        try {
            const user = await User.findOne({ chatId: ctx.chat.id });
            ctx.session.lang = user.lang;

            await ctx.reply(localization[ctx.session.lang]["locationWrite"]);
        } catch (error) {
            console.log(error);
        }
    });

    location.on("message", async (ctx) => {
        try {
            const user = await User.findOne({ chatId: ctx.chat.id });
            ctx.session.lang = user.lang;

            const buttons = [];
            const buttonActionIndexes = [];
            const locations = await directGeocode(ctx.message.text);
            let ruFlag = false;

            locations.forEach((location, index) => {
                const { country } = location;

                if (country === "UA") {
                    buttons.push(
                        new Array(
                            Markup.button.callback(
                                location.state
                                    ? `${location.name}, ${location.state}`
                                    : `${location.name}`,
                                index.toString()
                            )
                        )
                    );
                    buttonActionIndexes.push(index);
                } else if (country === "RU") ruFlag = true;
            });

            if (ruFlag) {
                await ctx.replyWithMediaGroup([
                    {
                        media: {
                            source: fs.createReadStream(
                                fs.realpathSync(".") + "/assets/ruError.jpg"
                            ),
                        },
                        caption:
                            localization[ctx.session.lang]["locationErrorRU"],
                        type: "photo",
                    },
                ]);
            }
            if (buttons.length) {
                await ctx.reply(
                    localization[ctx.session.lang]["locationChoose"],
                    Markup.inlineKeyboard(buttons)
                );

                buttonActionIndexes.forEach((index) => {
                    location.action(index.toString(), async (ctx) => {
                        try {
                            const { name, lat, lon } = locations[index];
                            await User.updateOne(
                                { chatId: ctx.chat.id },
                                {
                                    location: {
                                        name,
                                        coordinates: {
                                            lat,
                                            lon,
                                        },
                                    },
                                }
                            );
                            await ctx.reply(
                                localization[ctx.session.lang][
                                    "locationCongratulations"
                                ]
                            );

                            // restart notifications
                            await Restart();

                            await ctx.scene.enter(scenes.FORECAST);
                        } catch (error) {
                            console.log(error);
                        }
                    });
                });
            } else {
                await ctx.reply(
                    localization[ctx.session.lang]["locationNotFound"]
                );

                await ctx.scene.enter(scenes.LOCATION);
            }
        } catch (error) {
            console.log(error);
        }
    });

    return location;
};

export default locationScene();
