import { Text, View } from 'react-native';
import React, {Component} from 'react';
import Meteor, { withTracker } from 'react-native-meteor';

import SignOut from './SignOut';
import SignIn from './SignIn';
// @connectMeteor
class App extends Component {
    constructor(props) {
        super(props);
        this.data = {};
    }
    componentWillMount() {
        console.log('comonent will mount');
        const url = 'http://192.168.2.163:3000/websocket';
        Meteor.connect(url);
    }

   
    
    render() {
        
        console.log('user ne: ',Meteor.user());
        if (Meteor.user()) {
            return <SignOut />
        }
        return <SignIn />;
    }
}

const myMetewoes = withTracker(params => {
    const handle = Meteor.subscribe('users');
    todosReady = handle.ready();
    getUser = Meteor.user();
    if(todosReady){
        dataUser = getUser;
        
    }else {
        dataUser = null;
    }
    return {
        dataUser,
    }
    
})(App);

export default myMetewoes;