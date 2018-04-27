import React, { Component } from 'react';
import logo from './AeroLogo_white.png';
import huskyLeft from './huskyleft2.gif'
import huskyRight from './huskyright2.gif'
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

import {List, ListItem} from 'material-ui/List';



const style = {
  margin: 12,
};

const sendPlane = <i class="fa fa-paper-plane"></i>

class App extends Component {
  constructor(props){
    super(props)
    this.connect = this.connect.bind(this)
    this.submit=this.submit.bind(this)
    this.updateInputValue=this.updateInputValue.bind(this)
    this.state = {
      inputValue: '',
      messageValue: '',
      numMessages: 0
    };

    this.setNameEntry = true

    this.messageListItems = []
    this.nameEntry = <div>
                        <p className="App-intro">
                          Enter a name below to get started
                        </p>
                        <TextField
                          id="message_field"
                          value={this.state.inputValue}
                          onChange={evt => this.updateInputValue(evt)}
                        /><br />
                      </div>
    this.connectButton = <RaisedButton label="Connect" style={style} onClick={() => this.submit()} />


  }
  /*
  componentDidMount(){
    var list = document.getElementById("scroll-list");
    list.scrollTop = list.offsetHeight;
    this.setState({
      scroll: 'set'
    })
  }
*/
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    //console.log("UPDATE")
    this.scrollToBottom();
  }
  updateInputValue(evt) {
    console.log(evt.target.value)
    this.setState({
      inputValue: evt.target.value
    });
    console.log(this.state)
    console.log(evt.target.value)
  }
  updateMessageValue(evt){
    this.setState({
      messageValue: evt.target.value
    });
  }
  sendMessage(){
    //console.log("message sent")

    this.ws.send(this.state.messageValue)
    if (this.state.messageValue.startsWith("!nick")){
      this.setState({inputValue: this.state.messageValue.substr(this.state.messageValue.indexOf(' ')+1)});

    }
    else{
      this.messageListItems.push(
        <li style={{textAlign: 'left', margin: 0, backgroundColor: 'green', color: 'white', borderRadius: "15px"}}>
          <p>
            {this.state.inputValue}:&nbsp;
            {this.state.messageValue}
          </p>
        </li>
      )
    }
    //console.log(this.messageListItems)
    this.setState({
      messageValue: ''
    })
  }


  connect(){
    this.ws = new WebSocket('ws://egs-services-c.aero.org:31432');
    this.ws.onopen = (event) => {
      this.ws.send("!nick " + this.state.inputValue)
    }
    this.ws.onclose = (event) => {
      alert ("You have been disconnected from the server!")
      this.nameEntry = <div>
                          <p className="App-intro">
                            Enter a name below to get started
                          </p>
                          <TextField
                            id="message_field"
                            value={this.state.inputValue}
                            onChange={evt => this.updateInputValue(evt)}
                          /><br />
                        </div>
      this.connectButton = <RaisedButton label="Disconnect" style={style} onClick={() => this.disconnect()} />
      this.setState({connected: false})
    }
    this.ws.onmessage = (event) => {
      //console.log(event.data);
      this.messageListItems.push(
        <li style={{textAlign: 'left', backgroundColor: 'red', color: 'white', borderRadius: "15px"}}>
          <p>
            {event.data}
          </p>

        </li>
      )
      this.setState({
        numMessages: this.state.numMessages + 1
      })
      this.scrollToBottom()
    };
  }
  submit(){
    if (this.state.inputValue.length > 0){
      this.connect()
    }
    this.setNameEntry = false
    this.connectButton = <RaisedButton label="Disconnect" style={style} onClick={() => this.disconnect()} />
    this.setState({connected: true})
  }
  disconnect(){
    this.ws.close()
    this.nameEntry = <div>
                        <p className="App-intro">
                          Enter a name below to get started
                        </p>
                        <TextField
                          id="message_field"
                          value={this.state.inputValue}
                          onChange={evt => this.updateInputValue(evt)}
                        /><br />
                      </div>
    this.connectButton = <RaisedButton label="Disconnect" style={style} onClick={() => this.disconnect()} />
    this.setState({connected: false})
  }
  /*
  scrollToBottom() {
    console.log(this.el)
    this.el.scrollIntoView({ behavior: 'smooth' });
    this.el.scrollTop = this.el.scrollHeight
  }
*/
  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    if (this.setNameEntry){
      this.nameEntry = this.nameEntry = <div>
                          <p className="App-intro">
                            Enter a name below to get started
                          </p>
                          <TextField
                            id="message_field"
                            value={this.state.inputValue}
                            onChange={evt => this.updateInputValue(evt)}
                          /><br />
                        </div>
    }
    else{
      this.nameEntry = null
    }
    /*<img src={logo} className="App-logo" alt="logo" />
    <p style={{fontSize: 4}}>Sorry, no spinny logo! :)</p>
    */

    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header" id="container">
            <div>
              <img src={huskyLeft} loop='infinite' style={{maxWidth:'100%', maxHeight:'100%'}}></img>
            </div>
            <div>
            <h1 className = "App-title"> JChat </h1>

            <h1 className="App-subtitle">Websocket Client With React</h1>
            </div>
            <div>
              <img src={huskyRight} style={{maxWidth:'100%', maxHeight:'100%'}}></img>
            </div>
          </header>

          {this.nameEntry}
          {this.connectButton}

          <div
            style={{maxHeight: '20em', overflow: 'auto'}}
            ref={(div) => {  this.messageList = div; }}
          >
            <ul id="scroll-list">

              {this.messageListItems}
            </ul>
          </div>
          <div className="footer-chat-bar">
            <TextField
              id="message_field"
              className="message_field"
              style={{width: '85%', paddingLeft: '10px', float: "left"}}
              value={this.state.messageValue}
              onChange={evt => this.updateMessageValue(evt)}
              onKeyPress={(ev) => {
                //console.log(`Pressed keyCode ${ev.key}`);
                if (ev.key === 'Enter') {
                  this.sendMessage()
                  ev.preventDefault();
                }
              }}
            />
            <IconButton
            iconClassName="fa fa-paper-plane"
            style={{float: 'left'}}
            onClick={() => this.sendMessage()} />
          </div>

        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
