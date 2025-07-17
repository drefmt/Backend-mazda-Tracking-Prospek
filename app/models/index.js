const dbConfig = require('../config/db.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;

db.users = require('./users.models')(mongoose);
db.prospek = require('./prospek.models')(mongoose);
db.spk = require('./spk.models')(mongoose);
db.testDrive = require('./testDrive.models')(mongoose);
db.retail = require('./retail.models')(mongoose);
db.notification = require('./notifiction.models')(mongoose);
db.feedback = require('./feedback.models')(mongoose);
db.feedbackLink = require('./feedbackLink.models')(mongoose);
db.dailyActivity = require('./dailyActivity.models')(mongoose)
module.exports = db;