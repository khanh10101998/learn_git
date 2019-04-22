import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image } from 'react-native';

import firebase from 'react-native-firebase';
import Meteor, { withTracker } from 'react-native-meteor';

import SignIn from './app/SignIn';
import { createStackNavigator, createAppContainer  } from 'react-navigation';
import SceenChat from './app/ScreenChat'
import SignOut from './app/SignOut'
console.disableYellowBox = true;


class PhoneAuthTest extends Component {
  constructor(props) {
    super(props);
    this.LogOut = this.signOut.bind(this);
    this.unsubscribe = null; 
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+84',
      confirmResult: null,
    };
  }

  
  componentWillMount() {
    const url = 'http://192.168.2.163:3000/websocket';
    Meteor.connect(url);
  }
  componentDidMount() {
  
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
        this.setState({phoneNumber: user.phoneNumber});
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+84',
          confirmResult: null,
        });
      }
    });
  }
  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    console.log('APP__Singin()');
    const { phoneNumber } = this.state;
    this.setState({ message: 'Sending code ...' });

    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
      .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    console.log("App Screen__ConfirmCode() :", codeInput, confirmResult);
    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    // firebase.auth().signOut();
    console.log('sign out firebse ne')
  }

  renderPhoneNumberInput() {
    console.log("App__RenderPhoneNumberInput()");
    const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={'Phone number ... '}
          value={phoneNumber}
        />
        <Button title="Sign In" color="green" onPress={this.signIn} />
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    console.log('App_renderverificationCodeIinput()');
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
      </View>
    );
  }

  render() {
    const { navigate } = this.props.navigation;


    const { user, confirmResult, phoneNumber } = this.state;
    
// login firebse
    return (
      <View style={{ flex: 1 }}>

        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {user && (
          <SignIn navigate= {navigate} email={phoneNumber} />
        )
        
        }
      </View>
    );
  }
}

const StackNavigation = createStackNavigator({
  Login: { screen: PhoneAuthTest },
  ScreenChat: { screen: SceenChat },
  SignOut: { screen: SignOut }
});
const Main = createAppContainer(StackNavigation);
export default Main;
