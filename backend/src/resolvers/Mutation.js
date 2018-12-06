const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    //This is the point where we interface with the Prisma
    //Our API is everything that is present inside the prisma.graphql
    // We can access database using ctx.db
    // info argument has the infomation of what item needs to be returned after its created
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
    // TODO Check if they are already logged in
  },
  async updateItem(parent, args, ctx, info) {
    // first take copy of update
    const updates = { ...args };
    // remove ID from updates. because ID is something which u dont want to update.
    delete updates.id;
    // run update method
    const item = await ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      },
      info
    });
    return item;
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    //1. find the item

    // We are querying in mutation. so info will not be having any value now. So we pass our own graphql query
    const item = await ctx.db.query.item({ where }, `{id title}`);
    //2. check if item belongs to this user or has permission
    //3. delete the item
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signUp(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // create password hash
    const password = (args.password = await bcrypt.hash(args.password, 10)); // The second parameter is SALT, this is used for security purpose. If another user has same password as that of first user, then the hash generated will be different.
    // create user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] } // Setting enum
        }
      },
      info
    );

    // create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // We set the jwt as cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // Return user to the browser
    return user;
  },
  async signIn(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({
      where: { email }
    });
    if (!user) {
      throw Error("No such user found..!!");
    }
    // 2. check if the password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw Error("Invalid password..!!");
    }
    // 3. generate the jwt token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 24 * 60 * 60 * 365
    });
    // 5. return the user
    return user;
  },

  signOut(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Googbye..!!!" };
  },

  async requestReset(parent, args, ctx, info) {
    //1. Check if its a real user
    const user = await ctx.db.query.user({
      where: {
        email: args.email
      }
    });
    if (!user) {
      throw new Error("No user found..!!");
    }
    //2. Reset expiry token
    // generate randomBytes of length 20 and convert it to hex
    // calling it asynchronously
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: {
        email: user.email
      },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });
    console.log(res);
    return { message: "Hello" };

    //3. Email the reset token
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    // 2. check if its legit reset token
    // 3. check if its expired

    // Lets query users and destructure it to the first element. Because, users query has UserWhereInput, providing more options for better querying
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000 // check within 1 hour time limit
      }
    });

    if (!user) {
      throw new Error("Invalid password reset token..!!");
    }
    // 4. hash the new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. save the new password and remove old reset token fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: {
        email: user.email
      },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    // 6. generate jwt
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. set the jwt
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 8. return new user
    return updatedUser;
  }
};

module.exports = Mutations;
