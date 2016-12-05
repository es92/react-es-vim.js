// @flow

declare var VimJS: any;
declare var VimCanvas: any;

import { VimJS } from 'es-vim.js/web/vim_loader.js'
import VimCanvas from 'es-vim.js/web/vim_canvas_ui.js'

import React, { Component } from 'react';

type InitialFsTask = { kind: 'create', path: string, filename: string, contents: string } | 
                     { kind: 'remote', serverAddr: string }

type VimProps = {
  initialFile?: string,
  initialPath?: string,
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
      vimjs.load_remotefs(initialFsTask.serverAddr);
      return;
    default: 
      throw ((impossible: empty) => {})(initialFsTask.kind);
    }
  }

  componentDidMount() {
    const { initialFile, initialPath, home, onVimFsLoaded, initialFsTask } = this.props;
    const vimjs = new VimJS();

    vimjs.load(start => {
      this.runFsTask(vimjs, initialFsTask);
      const canvas = this.canvas;
      const vc = new VimCanvas(vimjs, canvas);

      const callStart = onVimFsLoaded || (f => f());

      callStart(
        () => start({
          initialFile,
          initialPath,
          home,
          oninit: (finishInit) => finishInit()
        })
      );
    });

  }

  render() {
    return (
      <canvas 
        width={800} 
        height={400}
        tabIndex="1" 
        ref={ (r) => this.canvas = r }
      />
    );
  }
}
