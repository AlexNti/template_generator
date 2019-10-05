/**
 * Created by alexn on 18/12/2017.
 */
/**
 * Created by alexn on 20/07/2017.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  players: [{ type: Schema.Types.ObjectId, ref: "tests" }],
  questions:{type:Array}
});


module.exports = mongoose.model("test", schema);
