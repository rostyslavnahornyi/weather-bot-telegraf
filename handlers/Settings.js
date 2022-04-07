export default async (ctx) => {
    try {
        await ctx.scene.enter("settings");
    } catch (error) {
        console.log(error);
    }
};
