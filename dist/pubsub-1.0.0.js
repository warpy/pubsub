/**
 * pubsub v1.0.0 - 2014-03-28
 * A Pub/Sub library with complex topics
 *
 * Copyright (c) 2014 Sanket Parab <sanketsp@gmail.com>
 * Licensed MIT
 */
(function(_, undefined) {
  "use strict";

  var root = this || window;

  var PubSub = function() {
    this.tokens = {};
    this.conditions = [];
  };

  /*
  output:
  {
    key: [value (string), isString (bool)]
  }
  */
  function parseTopic(input) {
    var output = {};
    if (_.isString(input)) {
      _.each(input.split(/[\s*\,\s*]+/g), function(v, k) {
        if (v.indexOf('!') === 0) {
          output[k] = [v.substr(1), true];
        } else {
          output[k] = [v, true];
        }
      });
    } else if (_.isArray(input)) {
      _.each(input, function(v, k) {
        if (v.indexOf('!') === 0) {
          output[k] = [v.substr(1), true];
        } else {
          output[k] = [v, true];
        }
      });
    } else {
      _.each(input, function(v, k) {
        output[k] = [v, false, false];
      });
    }
    return output;
  }

  var tokenCount = 1;

  function Token(topicString, callbackFunction) {
    this.id = 'token_' + tokenCount++;
    this.topic = topicString;
    this.callback = callbackFunction;
    this.conditions = [];
    _.each(topicString.split('|'), function(topicOptions) {
      this.conditions.push(new Condition(topicOptions, this.id));
    }, this);
  }

  function Condition(topicOptions, tokenId) {
    this.checks = [];
    this.token = tokenId;
    this.hasString = false;
    _.each(topicOptions.split('&'), function(topicCondition) {
      var tuple = topicCondition.split('=');
      var isNegative = false;
      var isString = false;
      if (tuple.length === 1) {
        isString = true;
        this.hasString = true;
        tuple.unshift('sanket');
      }
      var key = tuple[0];
      if (tuple[0].indexOf('!') === tuple[0].length - 1) {
        isNegative = true;
        key = tuple[0].substr(0, tuple[0].length - 1);
      }
      var value = tuple[1];
      if (tuple[1].indexOf('!') === 0) {
        isNegative = true;
        value = tuple[1].substr(1);
      }
      this.checks.push({
        isNegative: isNegative,
        isString: isString,
        key: key,
        value: value
      });
    }, this);
  }
  Condition.prototype.qualifies = function(topicObject) {
    var topicKeys = _.keys(topicObject),
      topicValues = _.pluck(topicObject, 0),
      conditionKeys = _.unique(_.pluck(this.checks, 'key')),
      keysCheck = (conditionKeys.length === (_.intersection(conditionKeys, topicKeys)).length),
      stringsCheck = false,
      conditionQualifies;

    //Evaluate stringsCheck
    _.each(topicObject, function(v, k) {
      if (v[1] && this.hasString) {
        stringsCheck = true;
      }
    }, this);

    //Continue if keysCheck || stringsCheck
    conditionQualifies = keysCheck || stringsCheck;
    if (conditionQualifies) {
      _.each(this.checks, function(check) {
        var qualifies = false;
        if (stringsCheck && check.isString) {
          if (check.isNegative) {
            qualifies = _.indexOf(topicValues, check.value) === -1;
          } else {
            qualifies = _.indexOf(topicValues, check.value) > -1;
          }
        }
        if (keysCheck) {
          if (check.isNegative) {
            qualifies = check.value != topicObject[check.key][0]; // jshint ignore:line
          } else {
            qualifies = check.value == topicObject[check.key][0]; // jshint ignore:line
          }
        }
        conditionQualifies = conditionQualifies && qualifies;
      }, this);
    }
    return conditionQualifies;
  };

  function bind(topicString, callbackFunction) {
    var token = new Token(topicString, callbackFunction);
    this.tokens[token.id] = token;
    this.conditions = _.union(this.conditions, token.conditions);
    return token.id;
  }

  function trigger(topicObject, callbackData) {
    var tokenIds = {};
    topicObject = parseTopic(topicObject);
    _.each(this.conditions, function(condition, index) {
      if (condition.qualifies(topicObject)) {
        tokenIds[condition.token] = true;
      }
    }, this);
    _.each(tokenIds, function(flag, tokenId) {
      this.tokens[tokenId].callback.call(null, callbackData);
    }, this);
    return _.keys(tokenIds);
  }

  PubSub.prototype.bind = function(topicString, callbackFunction) {
    return bind.call(this, topicString, callbackFunction);
  };

  PubSub.prototype.trigger = function(topicObject, callbackData) {
    return trigger.call(this, topicObject, callbackData);
  };

  if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    exports = module.exports = PubSub;
  } else {
    this.PubSub = PubSub;
  }

}).call(this, _);
