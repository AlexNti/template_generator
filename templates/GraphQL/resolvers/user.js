const { combineResolvers } = require('graphql-resolvers');
const { AuthenticationError, UserInputError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const { isAdmin, isAuthenticated } = require('./authorization');

const createToken = async (user, secret, expiresIn) => {
  const {
    id, email, username, role,
  } = user;
  return await jwt.sign({
    id, email, username, role,
  }, secret, {
    expiresIn,
  });
};

const userGQL = {
  Query: {
    users: async (parent, args, { models }) => await models.User.find(),
    user: async (parent, { id }, { models }) => await models.User.findById(id),
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }

      return await models.User.findById(me.id);
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '30m') };
    },

    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, { username }, { models, me }) => await models.User.findByIdAndUpdate(
        me.id,
        { username },
        { new: true },
      ),
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const user = await models.User.findById(id);

        if (user) {
          await user.remove();
          return true;
        }
        return false;
      },
    ),
  },

  User: {
    messages: async (user, args, { models }) => await models.Message.find({
      userId: user.id,
    }),
  },
};

module.exports = userGQL;
