import  { 
    StyleSheet, Text, View, TouchableOpacity, Dimensions, Button,
    FlatList, TextInput
} from 'react-native';
import Meteor, { Accounts, withTracker, createContainer } from 'react-native-meteor';
import React, {Component} from 'react';
const { width } = Dimensions.get('window');
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';
class SignOut extends React.Component {

    AddRoom (name){
      
        Meteor.call('AddRoom', {name}, (err,res) => {
            console.log('room ne: ' ,err, res);
        });
    }
    constructor(props) {
        super(props);

        this.state = {
            RoomName:'',
                };
    }
  
    render() {
        const { navigate } = this.props.navigation;
        console.log('count: ', this.props.count)
        console.log('data signout: ', this.props.dataRoom)
        
        return (
            <View style = { {flex:1, flexDirection:'column'} } >
                
                <FlatList
                    data={this.props.dataRoom}
                    renderItem={({ item }) => 
                    <View>
                            <Text 
                            style={{ backgroundColor: 'blue', color:'white', margin:5, padding:18 }}
                                onPress={() => navigate("ScreenChat", { RID: item._id, RName: item.name.name }) } 
                            >
                                {item.name.name}
                            </Text>
                    </View>
                    }
                />
               
                <View style={ {height:50, flexDirection:'row'} }>
                    <TextInput
                        style = { {flex:3} }
                        onChangeText={(name) => this.setState({ RoomName: name })}
                        placeholder="Enter room name "
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Button
                    style = { {flex:1} }
                        title = 'Add room demo'
                        onPress={this.AddRoom.bind(this, "Room: " + this.state.RoomName)}
                    />

                </View>

                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        Meteor.logout();
                        // this.props.logout();
                        firebase.auth().signOut();
                    }
                    }>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        );
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
    },
});
// createContainer
const signout = createContainer(() => {
    const data = Meteor.subscribe('getUID');
    return {
        count: Meteor.collection('room').find({}).length,
        dataRoom: Meteor.collection('room').find({}),
       

    };
}, SignOut);

export default withNavigation(signout);

