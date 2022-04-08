import { scenes } from "../utils/consts.js";

export default async (ctx) => {
    await ctx.scene.enter(scenes.SETTINGS).catch((error) => console.log(error));
};
