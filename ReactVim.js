'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vim_loader = require('es-vim.js/web/vim_loader.js');

var _vim_canvas_ui = require('es-vim.js/web/vim_canvas_ui.js');

var _vim_canvas_ui2 = _interopRequireDefault(_vim_canvas_ui);

var _vimJs = require('es-vim.js/web/vim.js.mem');

var _vimJs2 = _interopRequireDefault(_vimJs);

var _vimJs3 = require('es-vim.js/web/vim.js.binary');

var _vimJs4 = _interopRequireDefault(_vimJs3);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Vim = function (_Component) {
  _inherits(Vim, _Component);

  function Vim() {
    _classCallCheck(this, Vim);

    return _possibleConstructorReturn(this, (Vim.__proto__ || Object.getPrototypeOf(Vim)).apply(this, arguments));
  }

  _createClass(Vim, [{
    key: 'runFsTask',
    value: function runFsTask(vimjs, initialFsTask) {
      if (initialFsTask == null) return;
      switch (initialFsTask.kind) {
        case 'create':
          vimjs.FS.createDataFile(initialFsTask.path, 'test', true, true, true);
          vimjs.FS.writeFile(initialFsTask.path + '/' + initialFsTask.filename, initialFsTask.contents);
          return;
        case 'remote':
          vimjs.load_remotefs(initialFsTask.serverAddr);
          return;
        default:
          throw function (impossible) {}(initialFsTask.kind);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          initialFile = _props.initialFile,
          initialPath = _props.initialPath,
          allowExit = _props.allowExit,
          vimrc = _props.vimrc,
          home = _props.home,
          onVimFsLoaded = _props.onVimFsLoaded,
          initialFsTask = _props.initialFsTask;


      var vimjs = new _vim_loader.VimJS();

      vimjs.load(function (start) {
        _this2.runFsTask(vimjs, initialFsTask);
        var canvas = _this2.canvas;
        var vc = new _vim_canvas_ui2.default(vimjs, canvas);

        vimjs.em_vimjs.on('exit', _this2.props.onClose);

        var callStart = onVimFsLoaded || function (f) {
          return f();
        };

        callStart(function () {
          return start({
            initialFile: initialFile,
            initialPath: initialPath,
            vimrc: vimrc,
            home: home,
            oninit: function oninit(finishInit) {
              return finishInit();
            }
          });
        });
      }, { memoryFilePath: _vimJs2.default, binaryFilePath: _vimJs4.default }, allowExit);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement('canvas', {
        width: 800,
        height: 400,
        style: { position: 'absolute', width: '100%', height: '100%' },
        tabIndex: '1',
        ref: function ref(r) {
          return _this3.canvas = r;
        }
      });
    }
  }]);

  return Vim;
}(_react.Component);

exports.default = Vim;

