const { PubSub } = require('apollo-server');

const { CREATED } = require('./message');

const EVENTS = {
  MESSAGE: CREATED,
};


module.exports = { EVENTS, pubSub: new PubSub() };
