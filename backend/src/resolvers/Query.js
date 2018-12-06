// If the Query is exactly as the same as that in Prisma, we can forward it

const { forwardTo } = require("prisma-binding");

const Query = {
  // async items(parent, args, ctx, info) {
  //   const item = await ctx.db.query.items();
  //   return item;
  // }
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current userID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
  }
};

module.exports = Query;
