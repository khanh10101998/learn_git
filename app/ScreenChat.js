import React,{Component} from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions, Button,
    FlatList
} from 'react-native';
import Meteor, { Accounts, withTracker, createContainer } from 'react-native-meteor';
const { width } = Dimensions.get('window')

class ScreenChat extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
            message: '',
            RoomID:'',
            UName:','
        };
    }
    componentDidMount(){
        this.setState({ 
            UName: this.props.UserName,
         })
    }

    AddMessage(RID, UID, Mess, UName) {
      

        Meteor.call('AddMessage', { RID, UID, Mess, UName }, (err, res) => {
            console.log('room ne: ', err, res);
        });
    }

    render(){
        const { params } = this.props.navigation.state
      
        // console.log('email :', Meteor.user().emails[0].address)
        return(
            <View style={styles.container }>
                <Text style={styles.messageTittle}>  {params.RName} </Text>
                {/* #########################################################################  ListView */}
                <View style={ {flex:11} }>
                    <FlatList
                        data={this.props.Messagedata}
                        renderItem={({ item }) => {
                            if (item.Room_id.UName == this.state.UName){
                                return (
                                    <View>
                                    <View style={styles.rightMessage} >
                                        <Text style={styles.textMessageRight}>  {item.Room_id.Mess}</Text>
                                    </View>
                                        <Text style={styles.textMessageNameRight}>{item.Room_id.UName} </Text>
                                    </View>
                                    )
                        }else{
                                return (
                                    <View>
                                    <View style={styles.leftMessage} >
                                            <Text style={styles.textMessageLeft}>  {item.Room_id.Mess}</Text>
                                    </View>
                                        <Text style={styles.textMessageNameLeft}>{item.Room_id.UName} </Text>
                                    </View>
                                )
                        }
                    }
}
                    />
                </View>
                {/* #########################################################################  ListView */}
                <View style={ {flex:1, flexDirection:'row', padding:5} }>
                    <TextInput
                        style={styles.input}
                        onChangeText={(name) => this.setState({ message: name })}
                        placeholder="send something ... "
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <View style={{ flex: 1, height: 36}}>
                        <TouchableOpacity
                            style={{ height: 36, backgroundColor:'#ff3f3f', justifyContent:'center' }}
                            onPress={this.AddMessage.bind(this, params.RID, Meteor.user()._id, this.state.message, Meteor.user().profile.name)}
                        >
                            <Text style={{color:'white', textAlign:'center'}}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
               
            </View>
        );
    }
}

const ELEMENT_WIDTH = width - 40;
const styles = StyleSheet.create({
   container: {
        flex: 14, 
        flexDirection: 'column', 
        backgroundColor: '#000000'
   },
    messageTittle: { 
        color: 'white', 
        backgroundColor: '#ff3f3f', 
        padding: 8 
    },

   leftMessage: {
       backgroundColor: '#ff2395', 
       borderRadius: 30, padding: 8, 
       margin: 10, 
       alignSelf: 'flex-start' 
   },
   rightMessage: {
       backgroundColor: '#ff3f3f', 
       borderRadius: 30, 
       padding: 8, 
       margin: 10, 
       alignSelf: 'flex-end'
    },
    textMessageRight:{
        color: 'white', 
        fontSize: 18,
        textAlign: 'justify'
    },
    textMessageLeft: {
        color: 'white', 
        fontSize: 18 
    },
    textMessageNameRight: {
        color: 'white', 
        fontSize: 10, 
        textAlign: 'right' 
    },
    textMessageNameLeft:{
        color: 'white', 
        fontSize: 10
    }
   ,
    input: {
        flex:5,
        
        fontSize: 16,
        height: 36,
        
        backgroundColor: '#FFFFFF',
        borderColor: '#888888',
        borderWidth: 1,
        // marginHorizontal: 20,
        // marginBottom: 10,
    },
    
});

export default Screenchat = createContainer((props) => {
    // lấy RoomID truyền trừ SignOut  dòng 45
    const RoomData = props.navigation.state;
    const RoomID = RoomData.params.RID;

    const Messagedata = Meteor.subscribe('getMessage',RoomID);

    return {
        Messagedata: Meteor.collection('Message').find({}),
        // lấy tên User
        UserName: Meteor.user().profile.name,

    };
}, ScreenChat);
