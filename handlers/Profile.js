export default async (ctx) => {
    try {
        await ctx.scene.enter("profile");
    } catch (error) {
        console.log(error);
    }
};
