import { Markup, Scenes } from "telegraf";
import { directGeocode } from "../utils/geocoder.js";
import localization from "../utils/localization.js";
import User from "../models/User.js";
import fs from 'fs';

const locationScene = (ctx) => {
    const location = new Scenes.BaseScene("location");

    location.enter(async (ctx) => {
        const user = await User.findOne({ chatId: ctx.chat.id });
        ctx.session.lang = user.lang;

        await ctx.reply(localization[ctx.session.lang]["locationWrite"]);
    });

    location.on("message", async (ctx) => {
        const user = await User.findOne({ chatId: ctx.chat.id });
        ctx.session.lang = user.lang;

        const buttons = [];
        const buttonActionIndexes = [];
        const locations = await directGeocode(ctx.message.text);
        let ruFlag = false;
        console.log(locations.length)

        locations.forEach(async (location, index) => {
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
                    media: { source: fs.createReadStream(fs.realpathSync('.') + "/assets/ruError.jpg") },
                    caption: localization[ctx.session.lang]["locationErrorRU"],
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
                    const { name, lat, lon } = locations[index];
                    await User.findOneAndUpdate(
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

                    await ctx.scene.enter("forecast");
                });
            });
        } else {
            await ctx.reply(localization[ctx.session.lang]["locationNotFound"]);

            await ctx.scene.enter("location");
        }
    });

    return location;
};

export default locationScene();
