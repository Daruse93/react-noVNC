"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _novncCore = _interopRequireDefault(require("novnc-core"));

var _keysym = _interopRequireDefault(require("./input/keysym.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createConnection = function createConnection(connectionName, isSecure, onDisconnect, onConnect, onPasswordPrompt, password, viewOnly) {
  var rfb = null;

  try {
    rfb = new _novncCore.default(document.getElementById('noVNC-canvas'), "ws".concat(isSecure ? 's' : '', "://").concat(connectionName), password && {
      credentials: {
        password: password
      }
    });
    rfb.addEventListener('connect', onConnect);
    rfb.addEventListener('disconnect', onDisconnect);
    rfb.addEventListener('credentialsrequired', onPasswordPrompt);
    rfb.scaleViewport = true;
    rfb.resizeSession = true;
    rfb.viewOnly = viewOnly;
  } catch (err) {
    console.error("Unable to create RFB client: ".concat(err));
    return onDisconnect({
      detail: {
        clean: false
      }
    });
  }

  return rfb;
};

var VncContainer =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(VncContainer, _React$Component);

    function VncContainer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, VncContainer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(VncContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "state", {
        status: 'initializing',
        connectionName: _this.props.connectionName,
        passwordRequired: false
      });

      _defineProperty(_assertThisInitialized(_this), "callKey", function (name) {
        var key = '';
        var code = '';

        switch (name) {
          case 'windows':
            key = _keysym.default.XK_Super_L;
            code = 'MetaLeft';
            break;

          case 'ctrl':
            key = _keysym.default.XK_Control_L;
            code = 'ControlLeft ';
            break;

          case 'alt':
            key = _keysym.default.XK_Alt_L;
            code = 'AltLeft';
            break;

          case 'esc':
            key = _keysym.default.XK_Escape;
            code = 'Escape';
            break;

          case 'tab':
            key = _keysym.default.XK_Tab;
            break;

          case 'ctrlaltdel':
            key = 'ctrlaltdel';
            break;

          default:
            return true;
        }

        if (key !== '') {
          var btn = document.getElementById("noVNC_toggle_".concat(name, "_button"));

          if (btn.classList.contains("noVNC_selected")) {
            if (key === 'ctrlaltdel') {
              _this.sendCtrlAltDel();
            } else {
              _this.rfb.sendKey(key, code, false);
            }

            btn.classList.remove("noVNC_selected");
          } else {
            if (key === 'ctrlaltdel') {
              _this.sendCtrlAltDel();
            } else {
              _this.rfb.sendKey(key, code, true);
            }

            btn.classList.add("noVNC_selected");
          }
        }
      });

      _defineProperty(_assertThisInitialized(_this), "onStatusChange", function () {
        _this.rfb.focus();

        _this.setState(function () {
          return {
            status: 'connected'
          };
        });

        _this.props.onBeforeConnect();
      });

      _defineProperty(_assertThisInitialized(_this), "onDisconnect", function (e) {
        return _this.props.onDisconnected(!e.detail.clean || _this.state.status !== 'connected');
      });

      _defineProperty(_assertThisInitialized(_this), "onUserDisconnect", function () {
        return _this.rfb.disconnect();
      });

      _defineProperty(_assertThisInitialized(_this), "onPasswordRequired", function () {
        return _this.setState(function () {
          return {
            passwordRequired: true
          };
        });
      });

      _defineProperty(_assertThisInitialized(_this), "onSubmitPassword", function (password) {
        _this.rfb.sendCredentials({
          password: password
        });

        _this.setState(function () {
          return {
            passwordRequired: false
          };
        });
      });

      return _this;
    }

    _createClass(VncContainer, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.rfb = createConnection(this.props.connectionName, this.props.isSecure, this.onDisconnect, this.onStatusChange, this.onPasswordRequired, this.props.password, this.props.viewOnly);
      }
    }, {
      key: "sendCtrlAltDel",
      value: function sendCtrlAltDel() {
        this.rfb.sendKey(_keysym.default.XK_Control_L, "ControlLeft", true);
        this.rfb.sendKey(_keysym.default.XK_Alt_L, "AltLeft", true);
        this.rfb.sendKey(_keysym.default.XK_Delete, "Delete", true);
        this.rfb.sendKey(_keysym.default.XK_Delete, "Delete", false);
        this.rfb.sendKey(_keysym.default.XK_Alt_L, "AltLeft", false);
        this.rfb.sendKey(_keysym.default.XK_Control_L, "ControlLeft", false);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.viewOnly !== prevProps.viewOnly) {
          this.rfb.viewOnly = this.props.viewOnly;
        }

        if (this.props.callKey !== '') {
          this.callKey(this.props.callKey);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var classNoVnc = this.props.isFullScreen ? 'fullscreen' : '';
        return _react.default.createElement("div", null, this.props.actionsBar && this.props.actionsBar({
          status: this.state.status,
          onDisconnect: this.onUserDisconnect
        }), this.state.passwordRequired && this.props.passwordPrompt({
          onSubmit: this.onSubmitPassword
        }), _react.default.createElement("div", {
          id: "noVNC-canvas",
          className: classNoVnc,
          style: {
            display: this.state.passwordRequired ? 'none' : 'block'
          }
        }));
      }
    }]);

    return VncContainer;
  }(_react.default.Component);

exports.default = VncContainer;

_defineProperty(VncContainer, "propTypes", {
  connectionName: _propTypes.default.string.isRequired,
  actionsBar: _propTypes.default.func,
  passwordPrompt: _propTypes.default.func,
  isSecure: _propTypes.default.bool,
  password: _propTypes.default.string,
  onBeforeConnect: _propTypes.default.func
});

_defineProperty(VncContainer, "defaultProps", {
  isSecure: false
});
