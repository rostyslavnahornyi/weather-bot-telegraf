import { Markup, Scenes, session } from "telegraf";
import User from "../models/User.js";
import schedule from "node-schedule";
import localization from "../utils/localization.js";
import { fetchData } from "../utils/dataFetching.js";
import { languages, notificationTimes, scenes } from "../utils/consts.js";

const settings = new Scenes.BaseScene(scenes.SETTINGS);
const settingsScene = () => {
    settings.enter(async (ctx) => {
        try {
            const user = await User.findOne({ chatId: ctx.chat.id });
            ctx.session.lang = await user.lang;

            ctx.reply(
                localization[ctx.session.lang]["settingsEnterQuestion"],
                Markup.keyboard([
                    [
                        localization[ctx.session.lang][
                            "settingsButtonLocations"
                        ],
                        localization[ctx.session.lang]["settingsButtonLang"],
                    ],
                    [
                        localization[ctx.session.lang][
                            "settingsButtonNotifications"
                        ],
                    ],
                    [localization[ctx.session.lang]["buttonBack"]],
                ])
                    .oneTime()
                    .resize()
            );

            settings.hears(
                localization[ctx.session.lang]["settingsButtonLocations"],
                ControllerLocation
            );
            settings.hears(
                localization[ctx.session.lang]["settingsButtonLang"],
                ControllerLang
            );

            settings.hears(
                localization[ctx.session.lang]["settingsButtonNotifications"],
                ControllerNotifications
            );
        } catch (error) {
            console.log(error);
        }

        settings.hears(
            localization[ctx.session.lang]["buttonBack"],
            async (ctx) => {
                await ctx.scene
                    .enter(scenes.PROFILE)
                    .catch((error) => console.log(error));
            }
        );
    });

    return settings;
};

async function ControllerLocation(ctx) {
    await ctx.scene.enter(scenes.LOCATION).catch((error) => console.log(error));
}

async function ControllerLang(ctx) {
    try {
        const user = await User({ chatId: ctx.chat.id });

        await ctx.reply(
            localization[user.lang]["settingsLanguageQuestion"],
            Markup.keyboard([
                [localization[ctx.session.lang]["settingsLanguageButtonUA"]],
                [localization[ctx.session.lang]["settingsLanguageButtonRU"]],
                [localization[ctx.session.lang]["settingsLanguageButtonEN"]],
            ])
                .oneTime()
                .resize()
        );

        async function changeLang(ctx, lang) {
            try {
                await User.updateOne({ chatId: ctx.chat.id }, { lang });
                ctx.session.lang = lang;
                await ctx.reply(
                    localization[ctx.session.lang]["settingsSuccess"]
                );

                await ctx.scene.enter(scenes.PROFILE);
            } catch (error) {
                console.log(error);
            }
        }

        settings.hears(
            localization[ctx.session.lang]["settingsLanguageButtonUA"],
            (ctx) => changeLang(ctx, languages.UA)
        );
        settings.hears(
            localization[ctx.session.lang]["settingsLanguageButtonRU"],
            (ctx) => changeLang(ctx, languages.RU)
        );
        settings.hears(
            localization[ctx.session.lang]["settingsLanguageButtonEN"],
            (ctx) => changeLang(ctx, languages.EN)
        );
    } catch (error) {
        console.log(error);
    }
}

async function ControllerNotifications(ctx) {
    try {
        const user = await User.findOne({ chatId: ctx.chat.id });

        const buttons = [];
        const times = notificationTimes;
        times.forEach((value) =>
            buttons.push(
                Markup.button.callback(value.toString(), value.toString())
            )
        );

        await ctx.reply(
            localization[ctx.session.lang]["settingsNotificationsQuestion"],
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
                try {
                    const chatId = ctx.chat.id;

                    const user = await User.findOneAndUpdate(
                        { chatId },
                        {
                            $set: {
                                "notifications.rule": `0 ${trigger} * * *`,
                            },
                        }
                    );

                    if (user.notifications.status) {
                        schedule.rescheduleJob(
                            chatId.toString(),
                            `0 ${trigger} * * *`
                        );
                    }

                    await ctx.reply(
                        localization[ctx.session.lang]["settingsSuccess"]
                    );
                    await ctx.scene.enter(scenes.PROFILE);
                } catch (error) {
                    console.log(error);
                }
            });
        });

        settings.action("toggle", async (ctx) => {
            try {
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
                                  weather.current +
                                      localization[ctx.session.lang][
                                          "globalSheduleInfo"
                                      ]
                              );
                          }
                      );

                await ctx.reply(
                    localization[ctx.session.lang]["settingsSuccess"]
                );
                await ctx.scene.enter(scenes.PROFILE);
            } catch (error) {
                console.log(error);
            }
        });

        settings.action("back", async (ctx) => {
            await ctx.scene
                .enter(scenes.SETTINGS)
                .catch((error) => console.log(error));
        });
    } catch (error) {
        console.log(error);
    }
}

export default settingsScene();
