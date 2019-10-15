const { combineResolvers } = require('graphql-resolvers');

const { EVENTS, pubsub } = require('../subscription');

const { isAuthenticated, isMessageOwner } = require('./authorization');

const toCursorHash = (string) => Buffer.from(string).toString('base64');

const fromCursorHash = (string) => Buffer.from(string, 'base64').toString('ascii');

const messageGQL = {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
          createdAt: {
            $lt: fromCursorHash(cursor),
          },
        }
        : {};
      const messages = await models.Message.find(
        cursorOptions,
        null,
        {
          sort: { createdAt: -1 },
          limit: limit + 1,
        },
      );

      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
    message: async (parent, { id }, { models }) => await models.Message.findById(id),
  },

  Mutation: {


    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { models, me }) => {
        const message = await models.Message.create({
          text,
          userId: me.id,
          createdAt: new Date().setSeconds(new Date().getSeconds() + 1),
        });
        return message;


        // pubsub.publish(EVENTS.MESSAGE.CREATED, {
        //   messageCreated: { message },
        // });
      },
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        const message = await models.Message.findById(id);

        if (message) {
          await message.remove();
          return true;
        }
        return false;
      },
    ),
  },

  Message: {
    user: async (message, args, { loaders }) => {
      return await loaders.user.load(message.userId.toString());
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },
};


module.exports = messageGQL;
