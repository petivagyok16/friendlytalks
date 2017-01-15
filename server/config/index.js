/**
 * Created by peti on 2016.05.01..
 */

var configValues = require('./config.json');

module.exports = {

    getDbConnectionString: function () {
        return 'mongodb://'+ configValues.username + ':' + configValues.password + '@ds015636.mlab.com:15636/friendlytalks';
    }

};