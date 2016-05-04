var Notification = require('../helpers/handler.actions').create('Notification');
var UserNotifications = require('../helpers/handler.actions').create('UserNotifications');
var User = require('../helpers/handler.actions').create('User');
var Order = require('../helpers/handler.actions').create('Order');
var Log = require('../helpers/handler.actions').create('Log');
var Text = require('../helpers/handler.actions').create('Text');
var Category = require('../helpers/handler.actions').create('Category');
var moment = require('moment');
var S = require('string');
var btoa = require('btoa')
var _ = require('lodash');
var modelName = 'text';
var actions = {
    log: (m) => {
        console.log(modelName.toUpperCase() + ': ' + m);
    }
};
exports.actions = {
    reportNotFound: reportNotFound
};

function reportNotFound(data, cb) {
    actions.log('reportNotFound=' + JSON.stringify(data));
    if (!data.code) return cb("code required", null);
    if (!data.categoryCode) return cb("categoryCode required", null);
    if (!data.categoryRootCode) return cb("categoryRootCode required", null);


    _withCatRoot(null, null);


    function _withCatRoot(err, cat) {
        if (err) return cb(err, null);
        if (!cat) {
            return Category.save({
                code: data.categoryRootCode,
                description: "Autogenerated category"
            }, _withCatRoot, ['code']);
        }
        Category.save({
            code: data.categoryCode,
            description: "Autogenerated page section",
            _parent: cat._id
        }, function(err, category) {
            if (err) return cb(err, null);
            return _withCat(category);
        }, ['code']);
    }

    function _withCat(category) {
        //si ya existe y fue updatedByHuman, no lo guarda.
        Text.get({
            code: data.code
        }, function(err, text) {
            if (err) return cb(err, null);
            if (text) {
                if (text.updatedByHuman && text.updatedByHuman == true) {
                    return cb(null, true); //nothing happens
                }
                else {
                    _update(category, text._id);
                }
            }
            else {
                _update(category);
            }
        })

    }

    function _update(category, textId) {
        var payload = {
            _category: category._id,
            code: data.code,
            description: 'Autogenerated',
            content: data.content || data.code
        };
        if (textId) payload._id = textId;
        Text.save(payload, function(err, text) {
            if (err) return cb(err, null);
            return cb(null, true); //created
        }, ['code']);
    }
}