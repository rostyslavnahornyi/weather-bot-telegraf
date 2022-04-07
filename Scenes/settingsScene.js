import { Markup, Scenes, session } from "telegraf";
import User from "../models/User.js";
import schedule from "node-schedule";
import localization from "../utils/localization.js";
import { fetchData } from "../utils/dataFetching.js";

const settingsScene = (ctx) => {
    const settings = new Scenes.BaseScene("settings");

    settings.enter(async (ctx) => {
        const user = await User.findOne({ chatId: ctx.chat.id });
        ctx.session.lang = await user.lang;

        ctx.reply(
            localization[ctx.session.lang]["settingsEnterQuestion"],
            Markup.keyboard([
                [
                    localization[ctx.session.lang]["settingsButtonLocations"],
                    localization[ctx.session.lang]["settingsButtonLang"],
                ],
                [localization[ctx.session.lang]["settingsButtonNotifications"]],
                [localization[ctx.session.lang]["buttonBack"]],
            ])
                .oneTime()
                .resize()
        );

        settings.hears(
            localization[ctx.session.lang]["settingsButtonLocations"],
            async (ctx) => {
                await ctx.scene.enter("location");
            }
        );
        settings.hears(
            localization[ctx.session.lang]["settingsButtonLang"],
            async (ctx) => {
                const user = await User({ chatId: ctx.chat.id });

                await ctx.reply(
                    localization[user.lang]["settingsLanguageQuestion"],
                    Markup.keyboard([
                        [
                            localization[ctx.session.lang][
                                "settingsLanguageButtonUA"
                            ],
                        ],
                        [
                            localization[ctx.session.lang][
                                "settingsLanguageButtonRU"
                            ],
                        ],
                        [
                            localization[ctx.session.lang][
                                "settingsLanguageButtonEN"
                            ],
                        ],
                    ])
                        .oneTime()
                        .resize()
                );

                settings.hears(
                    localization[ctx.session.lang]["settingsLanguageButtonUA"],
                    async (ctx) => {
                        const lang = "ua";
                        await User.updateOne({ chatId: ctx.chat.id }, { lang });
                        ctx.session.lang = lang;
                        await ctx.reply(localization[ctx.session.lang]["settingsSuccess"]);

                        await ctx.scene.enter("profile");
                    }
                );
                settings.hears(
                    localization[ctx.session.lang]["settingsLanguageButtonRU"],
                    async (ctx) => {
                        const lang = "ru";
                        await User.updateOne({ chatId: ctx.chat.id }, { lang });
                        ctx.session.lang = lang;
                        await ctx.reply(localization[ctx.session.lang]["settingsSuccess"]);

                        await ctx.scene.enter("profile");
                    }
                );
                settings.hears(
                    localization[ctx.session.lang]["settingsLanguageButtonEN"],
                    async (ctx) => {
                        const lang = "en";
                        await User.updateOne({ chatId: ctx.chat.id }, { lang });
                        ctx.session.lang = lang;
                        await ctx.reply(localization[ctx.session.lang]["settingsSuccess"]);

                        await ctx.scene.enter("profile");
                    }
                );
            }
        );

        settings.hears(
            localization[ctx.session.lang]["settingsButtonNotifications"],
            async (ctx) => {
                const user = await User.findOne({ chatId: ctx.chat.id });

                const buttons = [];
                const times = [6, 9, 12, 15, 18, 21, 24];
                times.forEach((value) =>
                    buttons.push(
                        Markup.button.callback(
                            value.toString(),
                            value.toString()
                        )
                    )
                );

                await ctx.reply(
                    localization[ctx.session.lang][
                        "settingsNotificationsQuestion"
                    ],
                    Markup.inlineKeyboard([
                        buttons,
                        [
                            Markup.button.callback(
                                user.notifications.status
                                    ? localization[ctx.session.lang][
                                          "settingsNotificationsButtonFALSE"
                                      ]
                                    : localization[ctx.session.lang][
                                          "settingsNotificationsButtonTRUE"
                                      ],
                                "toggle"
                            ),
                        ],
                        [
                            Markup.button.callback(
                                localization[ctx.session.lang]["buttonBack"],
                                "back"
                            ),
                        ],
                    ])
                );

                times.forEach((trigger) => {
                    settings.action(trigger.toString(), async (ctx) => {
                        const chatId = ctx.chat.id;

                        const user = await User.findOneAndUpdate(
                            { chatId },
                            {
                                $set: {
                                    "notifications.rule": `0 ${trigger} * * *`,
                                },
                            }
                        );
                        const weather = await fetchData(
                            user.lang,
                            user.location.coordinates
                        );

                        user.notifications.status ?
                        schedule.rescheduleJob(
                            chatId.toString(),
                            `${trigger} * * *`
                        ) : schedule.scheduleJob(chatId.toString(), user.notifications.rule, () => {
                            ctx.reply(
                                weather.current + localization[ctx.session.lang]["globalSheduleInfo"]
                            );
                        })
                        await ctx.reply(localization[ctx.session.lang]["settingsSuccess"]);

                        await ctx.scene.enter("profile");
                    });
                });
                settings.action("toggle", async (ctx) => {
                    const chatId = ctx.chat.id;
                    const user = await User.findOne({ chatId });
                    const status = user.notifications.status;

                    await User.updateOne(
                        { chatId },
                        {
                            $set: {
                                "notifications.status": !status,
                            },
                        }
                    );

                    const weather = await fetchData(
                        user.lang,
                        user.location.coordinates
                    );
                    status
                        ? schedule.cancelJob(chatId.toString())
                        : schedule.scheduleJob(
                              chatId.toString(),
                              user.notifications.rules,
                              () => {
                                  ctx.reply(
                                      weather.current + localization[ctx.session.lang]["globalSheduleInfo"]
                                  );
                              }
                          );

                    await ctx.reply(localization[ctx.session.lang]["settingsSuccess"]);

                    await ctx.scene.enter("profile");
                });
                settings.action("back", async (ctx) => {
                    await ctx.scene.enter("settings");
                });
            }
        );

        settings.hears(
            localization[ctx.session.lang]["buttonBack"],
            async (ctx) => {
                await ctx.scene.enter("profile");
            }
        );
    });

    return settings;
};

export default settingsScene();
