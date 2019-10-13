"use strict";

exports.__esModule = true;
exports.default = createAction;

var _invariant = _interopRequireDefault(require("../../invariant/invariant.js"));

var _isFunction = _interopRequireDefault(require("./utils/isFunction.js"));

var _identity = _interopRequireDefault(require("./utils/identity.js"));

var _isNull = _interopRequireDefault(require("./utils/isNull.js"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function createAction(type, payloadCreator, metaCreator) {
  if (payloadCreator === undefined) {
    payloadCreator = _identity.default;
  }

  (0, _invariant.default)((0, _isFunction.default)(payloadCreator) || (0, _isNull.default)(payloadCreator), 'Expected payloadCreator to be a function, undefined or null');
  var finalPayloadCreator = (0, _isNull.default)(payloadCreator) || payloadCreator === _identity.default ? _identity.default : function (head) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return head instanceof Error ? head : payloadCreator.apply(undefined, [head].concat(args));
  };
  var hasMeta = (0, _isFunction.default)(metaCreator);
  var typeString = type.toString();

  var actionCreator = function actionCreator() {
    var payload = finalPayloadCreator.apply(undefined, arguments);
    var action = {
      type: type
    };

    if (payload instanceof Error) {
      action.error = true;
    }

    if (payload !== undefined) {
      action.payload = payload;
    }

    if (hasMeta) {
      action.meta = metaCreator.apply(undefined, arguments);
    }

    return action;
  };

  actionCreator.toString = function () {
    return typeString;
  };

  return actionCreator;
}