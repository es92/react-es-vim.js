// @flow

declare var VimJS: any;

import { VimJS_WW } from 'es-vim.js/web/vim_loader.js'
import VimCanvas from 'es-vim.js/web/vim_canvas_ui.js'

import memoryFilePath from 'es-vim.js/web/vim.js.mem';
import binaryFilePath from 'es-vim.js/web/vim.js.binary';

import "./source-code-pro.css"

import React, { Component } from 'react';

type InitialFsTask = { kind: 'create', path: string, filename: string, contents: string } | 
                     { kind: 'remote', config: any }

type VimProps = {
  initialFile?: string,
  initialPath?: string,
  allowExit?: boolean,
  vimrc?: string,
  home?: string,
  onVimFsLoaded?: (startVim:() => any) => any,
  initialFsTask?: InitialFsTask
}

export default class Vim extends Component {
  props: VimProps;
  canvas: Node;
  runFsTask(vimjs: any, initialFsTask: ?InitialFsTask) {
    if (initialFsTask == null)
      return
    switch (initialFsTask.kind) {
    case 'create':
      vimjs.FS.createDataFile(initialFsTask.path, 'test', true, true, true);
      vimjs.FS.writeFile(`${initialFsTask.path}/${initialFsTask.filename}`, initialFsTask.contents);
      return;
    case 'remote':
      vimjs.load_remotefs(initialFsTask.config);
      return;
    default: 
      throw ((impossible: empty) => {})(initialFsTask.kind);
    }
  }

  componentDidMount() {
    const { initialFile, initialPath, allowExit, vimrc, home, onVimFsLoaded, initialFsTask } = this.props;

    const vimjs = new VimJS_WW();
    this._vimjs = vimjs;

    vimjs.load(start => {
      this.runFsTask(vimjs, initialFsTask);
      const canvas = this.canvas;
      new VimCanvas(vimjs, canvas);

      vimjs.em_vimjs.on('exit', () => {
        if (!this._closed)
          this.props.onClose();
      });

      window.vimjs = vimjs

      const callStart = onVimFsLoaded || (f => f());

      callStart(
        () => start({
          initialFile,
          initialPath,
          vimrc,
          home,
          oninit: (finishInit) => finishInit()
        })
      );
    }, { memoryFilePath, binaryFilePath }, allowExit);

  }

  componentWillUnmount() {
    this._closed = true;
    setTimeout(() => {
      this._vimjs.destroy();
    }, 0);
  }

  render() {
    return (
      <canvas
        width={800} 
        height={400}
        style={{position: 'absolute', width: '100%', height: '100%' }}
        tabIndex="1" 
        ref={ (r) => this.canvas = r }
      />
    );
  }
}
