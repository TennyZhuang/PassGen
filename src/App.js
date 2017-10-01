import React, { Component } from 'react';
import { Input, Checkbox, InputNumber, Icon } from 'antd';
import './App.css';
import 'antd/lib/checkbox/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/input-number/style/css';
import { sha256 } from 'js-sha256';
import _ from 'lodash';

const CheckboxGroup = Checkbox.Group;

const PLAIN_CHARSET_OPTIONS = ['lower', 'upper', 'digit'];

class App extends Component {
  constructor() {
    super();
    this.state = {
      keysentence: '',
      salt: '',
      len: 16,
      charset: PLAIN_CHARSET_OPTIONS,
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.copyPassword = this.copyPassword.bind(this);
  }

  handleChange(event) {
    const updateObj = {};
    let { keysentence, salt, charset, len } = this.state;
    switch (event.target.name) {
      case 'keysentence':
      keysentence = event.target.value;
      updateObj.keysentence = keysentence;
      break;

      case 'salt':
      salt = event.target.value;
      updateObj.salt = salt;
      break;

      case 'len':
      len = event.target.value;
      updateObj.len = len;
      break;

      case 'charset':
      charset = event.target.value;
      updateObj.charset = charset;
      break;

      default:
      console.error(`Invalid name: ${event.target.name}`);
      return;
    }

    let chars = [];
    if (charset.includes('lower')) {
      chars = chars.concat(Array.from('abcdefghijklmnopqrstuvwxyz'));
    }

    if (charset.includes('upper')) {
      chars = chars.concat(Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
    }

    if (charset.includes('digit')) {
      chars = chars.concat(Array.from('0123456789'));
    }

    const pass64 = sha256(keysentence + salt);
    const proportion = parseInt(64 / len);
    const codes = Array.from(pass64).map(c => parseInt(c, 16)).slice(0, len * proportion);
    const pass = _.chunk(codes, proportion)
                  .map(a => (a.map((e, idx) => Math.pow(16, idx) * e).reduce((x, y) => x + y)))
                  .map(v => chars[v % chars.length])
                  .join('');

    updateObj.password = pass;

    this.setState(updateObj);
  }

  copyPassword() {
    document.querySelector('input[name="password"]').select();
    document.execCommand("copy");
  }

  render() {
    const copyIcon = <a onClick={this.copyPassword}><Icon type="copy" /></a>;

    return (
      <div className="App">
        <div className="app-title">
          <h2>Password Generator</h2>
          <hr />
        </div>

        <Input placeholder="keysentence" name="keysentence" type="password" value={this.state.keysentence} onChange={this.handleChange} />
        <Input placeholder="salt" name="salt" value={this.state.salt} onChange={this.handleChange} />
        <InputNumber 
          min={6} 
          max={32} 
          value={this.state.len} 
          onChange={value => this.handleChange({ target: { name: 'len', value }})} />
        <CheckboxGroup 
          options={PLAIN_CHARSET_OPTIONS} 
          name="charset" 
          value={this.state.charset} 
          onChange={value => this.handleChange({ target: { name: 'charset', value }})} />
        <Input placeholder="password" name="password" value={this.state.password} addonAfter={copyIcon} />
      </div>
    );
  }
}

export default App;
