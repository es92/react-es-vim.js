import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Vim from './ReactVim.js';

class App extends Component {
  render() {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
      <Vim
        initialFsTask={{ kind: 'create', path: '/home/web_user', filename: 'test', contents: 'preloaded text'  }}
        initialFile="/home/web_user/test"
      />
      </div>
    );
  }
}

export default App;
