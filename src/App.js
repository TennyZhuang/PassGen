import React, { Component } from 'react';
import { Input, Checkbox, InputNumber, Icon, Form, Popconfirm } from 'antd';
import './App.css';
import 'antd/lib/checkbox/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/input-number/style/css';
import 'antd/lib/popconfirm/style/css';
import { sha256 } from 'js-sha256';
import _ from 'lodash';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const PLAIN_CHARSET_OPTIONS = ['lower', 'upper', 'digit'];

class App extends Component {
  constructor() {
    super();
    this.state = {
      keysentence: localStorage.getItem('keysentence') || '',
      salt: '',
      len: 16,
      charset: PLAIN_CHARSET_OPTIONS,
      password: '',
      _confirmVisiable: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.copyPassword = this.copyPassword.bind(this);
  }

  handleChange(event) {
    const updateObj = {};
    let { keysentence, salt, charset, len } = this.state;
    switch (event.target.name) {
      case 'keysentence':
      keysentence = event.target.value.trim();
      updateObj.keysentence = keysentence;
      break;

      case 'salt':
      salt = event.target.value.trim();
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
    const proportion = parseInt(64 / len, 10);
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

  saveKeysentence() {
    localStorage.setItem('keysentence', this.state.keysentence);
  }

  render() {
    return (
      <div className="App">
        <Popconfirm
          title="Are you sure to save keysentence on this browser?"
          visible={this.state._confirmVisiable}
          onConfirm={() => {
            this.saveKeysentence();
            this.setState({ _confirmVisiable: false });
          }}
          onCancel={() => this.setState({ _confirmVisiable: false })}/>

        <div className="app-title">
          <h2>Password Generator</h2>
          <hr />
        </div>

        <Form layout="vertical">
          <FormItem label="keysentence">
            <Input
              placeholder="keysentence"
              name="keysentence"
              type="password"
              value={this.state.keysentence}
              onChange={this.handleChange}
              addonAfter={<a onClick={() => this.setState({ _confirmVisiable: true })}><Icon type="save" /></a>} />
          </FormItem>
          <FormItem label="salt">
            <Input placeholder="salt" name="salt" value={this.state.salt} onChange={this.handleChange} />
          </FormItem>
          <FormItem label="len">
            <InputNumber
              min={6}
              max={32}
              value={this.state.len}
              onChange={value => this.handleChange({ target: { name: 'len', value }})} />
          </FormItem>
          <FormItem label="charset">
            <CheckboxGroup
              options={PLAIN_CHARSET_OPTIONS}
              name="charset"
              value={this.state.charset}
              onChange={value => this.handleChange({ target: { name: 'charset', value }})} />
          </FormItem>
          <FormItem label="password">
            <Input
              readOnly
              placeholder="password"
              name="password"
              value={this.state.password}
              addonAfter={<a onClick={this.copyPassword}><Icon type="copy" /></a>} />
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default App;
