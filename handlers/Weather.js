import { scenes } from "../utils/consts.js";

export default async (ctx) => {
    await ctx.scene.enter(scenes.FORECAST).catch((error) => console.log(error));
};
