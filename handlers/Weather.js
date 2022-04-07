export default async (ctx) => {
    try {
        await ctx.scene.enter("forecast");
    } catch (error) {
        console.log(error);
    }
};
