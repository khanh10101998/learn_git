import { 
    StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions, Button 
} from 'react-native';
import React,{Component} from 'react';
import Meteor, { Accounts, withTracker} from 'react-native-meteor';
import SignOut from './SignOut';
const { width } = Dimensions.get('window')

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: null,
            password: '',
            name: '',
            error: null, 
            navigate:'',
        };
    }
    componentDidMount() {
        this.setState( 
            {
                email: this.props.email ,
                navigate: this.props.navigate,
            });
    }
    isValid() {
        const {password } = this.state;
        let valid = false;

        if ( password.length > 0) {
            valid = true;
        }

        // if (email.length === 0) {
        //     this.setState({ error: 'You must enter an email address' });
        // } else if (password.length === 0) {
        //     this.setState({ error: 'You must enter a password' });
        // }

        return valid;
    }
    onSignIn ()  {
        const { email, password } = this.state;

        if (this.isValid() && email != null) {
            const newEmail = email + '@gmail.com'
            console.log('new Email: ', newEmail);
            Meteor.loginWithPassword(newEmail, password, (error) => {
                if(error){
                    this.setState( { error: error.reason } );
                }else{
                    alert('login ok');
                }
            });
        }else{
            console.log('email signin ne: ', email);
        }
    }

    onCreateAccount (name) {
        const {email, password } = this.state;
        console.log(email, password)
        if (this.isValid() && email != null) {
            const newEmail = email + '@gmail.com';

            Accounts.createUser({ email: newEmail ,password:password, profile: {
                name: name,
            }}, (error) => {
                if (error) {
                    console.log('create error: ' + error.reason);
                    this.setState({ error: error.reason });
                    alert(error.reason );
                } else {
                    console.log('create okay hehe ');
                    this.onSignIn(); 
                }
            });
        }else{
            alert('xin nhap pass');
        }
    }
    render() {
        const name = this.state.name;
      if (Meteor.user()) {
        return <SignOut/>
        //   return this.props.navigate('ScreenChat');
    }else{
        return (
            <View style={styles.container}>
                <Text>{this.state.email}</Text>
                
                <TextInput
                    style={styles.input}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder="Password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                />
  
                <Text style={styles.error}>{this.state.error}</Text>
                <TouchableOpacity style={styles.button} onPress={
                     () => {this.onSignIn() }}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
{/* ####################################################################################### create account */}
            <View style={ {backgroundColor:'red'} }>
                <TextInput
                    style={styles.input}
                    onChangeText={(name) => this.setState({ name })}
                    placeholder="please enter your name "
                    autoCapitalize="none"
                    autoCorrect={false}
                    
                />
            
                 
                    <TouchableOpacity style={{
                        backgroundColor: '#3B5998',
                       
                        padding: 10,
                        alignItems: 'center',
                        marginBottom: 10,} } onPress = { 
                   () => { 
                       if (name.length > 0){
                        this.onCreateAccount(name) 
                       }else{
                           alert('xin nhap ten')
                       }
                       
                       } } >
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            </View>
{/* ####################################################################################### create account */}
            </View>
        );
                }
    }
}

const ELEMENT_WIDTH = width - 40;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    input: {
        width: ELEMENT_WIDTH,
        fontSize: 16,
        height: 36,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderColor: '#888888',
        borderWidth: 1,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#3B5998',
        width: ELEMENT_WIDTH,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '500',
        fontSize: 16,
    }
});


const Login = withTracker(() => {
    const handle = Meteor.subscribe('users');
    todosReady = handle.ready();
    getUser = Meteor.user();
    if (todosReady) {
        dataUser = getUser;

    } else {
        dataUser = null;
    }
    return {
        dataUser,
    }

})(SignIn);
export default Login;