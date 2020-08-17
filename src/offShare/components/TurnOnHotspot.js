import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'apsl-react-native-button';
import style from '../model/style';
import { HotspotWizard } from 'react-native-wifi-and-hotspot-wizard';
import Toast from 'react-native-simple-toast';
import { NetworkInfo } from 'react-native-network-info';
import SocketConnection from './FileTransfer';
import RNFetchBlob from 'rn-fetch-blob';
var net = require('net');
const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';

let TurnOnHotspot = (props) => {
  let win = Dimensions.get('window');
  let [HotspotSSID, setHotspotSSID] = useState();
  let [HotspotPassword, setHotspotPassword] = useState();
  let [HotspotPasscode, setHotspotPasscode] = useState();
  let showTurnOnHotspotModal = props.showTurnOnHotspotModal;
  let [connected, setHotspotConnected] = useState(false);
  return (
    <View
      style={{ height: win.height / 2, backgroundColor: '#fff', padding: 10 }}>
      {connected ? (
        <View style={{ alignSelf: 'center', marginTop: 20 }}>
          <Icon
            name="check-circle"
            color="green"
            size={150}
            style={{ alignSelf: 'center' }}></Icon>
          <Text style={{ fontSize: 35, alignSelf: 'center' }}>
            Hotspot Active{' '}
          </Text>
          {connected == 'success' ? (
            <Text>Here are your credentials</Text>
          ) : (
              <Text></Text>
            )}
          <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold' }}>
            ID : {HotspotSSID}{' '}
          </Text>
          <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold' }}>
            Password : {HotspotPassword}{' '}
          </Text>
          <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold' }}>
            Passcode : {HotspotPasscode}{' '}
          </Text>
        </View>
      ) : (
          <>
            <Text style={style.text}>Setup Hotspot </Text>
            <Text></Text>
            {/* <Text style={style.text}>Hotspot SSID</Text>
            <TextInput
              style={{ borderBottomColor: '#212121', borderBottomWidth: 2 }}
              placeholder="SSID"
              onChangeText={(text) => {
                setHotspotSSID(text);
              }}></TextInput>
            <Text></Text>
            <Text style={style.text}>Hotspot Password</Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => {
                setHotspotPassword(text);
              }}
              style={{ borderBottomColor: '#212121', borderBottomWidth: 2 }}
              placeholder="Password"></TextInput> */}
            <Button
              style={{
                backgroundColor: '#00e676',
                width: '100%',
                height: 50,
                left: 12,
                borderWidth: 0,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 60,
              }}
              onPress={() => {
                Toast.show('Starting Hotspot... Please Wait');
                connectToHotspot();
              }}>
              <View>
                <Text style={style.headerText}> Start Hotspot </Text>
              </View>
            </Button>
          </>
        )}

      <Button
        style={{
          backgroundColor: '#212121',
          width: '100%',
          height: 50,
          left: 12,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
        }}
        onPress={() => {
          showTurnOnHotspotModal(false);
        }}>
        <View>
          <Text style={style.headerText}> Close </Text>
        </View>
      </Button>
    </View>
  );

  function connectToHotspot() {
    HotspotWizard.turnOnHotspot(HotspotSSID, HotspotPassword).then((data) => {
      console.log(data);
      if (data.status == 'success' || data.status == 'auth') {
        setHotspotConnected(data.status);
        if (data.status == 'auth') {
          setHotspotPassword(data.password);
          let ID = '';
          let temp = (data.SSID);
          for (var i = 13; i < 17; i++) {
            ID += temp[i];
          }
          setHotspotSSID(ID);
          NetworkInfo.getIPV4Address().then((ipv4Address) => {
            console.log(ipv4Address);
            x = ipv4Address;
            console.log(x);
            var j = 0;
            let arr = '';
            let passcode = '';
            for (var i = 0; i < x.length; i++) {
              if (x[i] != '.') {
                j++;
                arr += x[i];
              }
              else {
                passcode += j;
                j = 0;
              }
            }
            passcode += j;
            passcode += arr;
            setHotspotPasscode(passcode);
            console.log(passcode);
          });
        }
      } else {
        Toast.show('Something went wrong');
      }
    });
    startServer();
  }

  async function startServer() {
<<<<<<< HEAD
=======
    let j = 0;
    let receivedBuffers = [];
>>>>>>> 138cc7b2faa641a3aa65fcf89a283d5200db5ee5
    let serverPort = 7251;
    let server = net.createServer((socket) => {
      console.log('server connected on ' + JSON.stringify(socket.address()));

      socket.on('data', (data) => {
        console.log('Server Received: ' + data);
<<<<<<< HEAD
        socket.write('Verified');
        if(data == 'Verified') {
          showTurnOnHotspotModal(false);
          console.log('temp test');
        }
        else {
          handleDataChannelFileReceived(data);
=======
        if (data == 'Verified') {
          socket.write('Verified');
          console.log('temp test');
        } else if (data != 'EOF') {
          console.log('pushing into buffer');
          receivedBuffers.push(data);
          console.log(receivedBuffers.length);
        } else if (data == 'EOF') {
          console.log('file end');
          Toast.show('File received');
          RNFetchBlob.fs
            .writeStream(RNFetchBlob.fs.dirs.DownloadDir + '/test2.pdf', 'base64')
            .then((stream) => {
              for (let i = 0; i < receivedBuffers.length; i++) {
                stream.write(receivedBuffers[i].toString('utf-8'));
                console.log(receivedBuffers[i].toString('utf-8'));
              }
              console.log(receivedBuffers);
              console.log('File completely received');
              Toast.show('File saved');
              receivedBuffers = [];
              return stream.close();
            });
        } else {
          console.log('file cannot be received completely');
>>>>>>> 138cc7b2faa641a3aa65fcf89a283d5200db5ee5
        }
      });

      socket.on('error', (error) => {
        console.log('error ' + error);
      });

      socket.on('close', (error) => {
        console.log('server client closed ' + (error ? error : ''));
      });
    }).listen(serverPort, () => {
      console.log('opened server on ' + JSON.stringify(server.address()));
    });

    server.on('error', (error) => {
      console.log('error ' + error);
    });

    server.on('close', () => {
      console.log('server close');
    });
  };
};

<<<<<<< HEAD
const handleDataChannelFileReceived = (data) => {
  console.log('data incoming');
  let receivedBuffers = [];

  try {
    if (data !== END_OF_FILE_MESSAGE) {
      receivedBuffers.push(data);
    } else if (data === END_OF_FILE_MESSAGE) {
      RNFetchBlob.fs
        .writeStream(RNFetchBlob.fs.dirs.DownloadDir + '/test2.pdf', 'base64')
        .then((stream) => {
          for (let i = 0; i < receivedBuffers.length; i++) {
            stream.write(receivedBuffers[i]);
          }
          console.log(receivedBuffers);
          console.log('File completely received');
          receivedBuffers = [];
          return stream.close();
        });
    } else {
      console.log('file cannot be received completely');
    }
  } catch (err) {
    console.log('File transfer failed');
  }
};
=======
// const handleDataChannelFileReceived = (data) => {
//   console.log('data incoming');
//   let receivedBuffers = [];

//   try {
//     if (data !== END_OF_FILE_MESSAGE) {
//       receivedBuffers.push(data);
//     } else if (data === END_OF_FILE_MESSAGE) {
//       console.log('file end');
//       RNFetchBlob.fs
//         .writeStream(RNFetchBlob.fs.dirs.DownloadDir + '/test2.pdf', 'base64')
//         .then((stream) => {
//           for (let i = 0; i < receivedBuffers.length; i++) {
//             stream.write(receivedBuffers[i]);
//           }
//           console.log(receivedBuffers);
//           console.log('File completely received');
//           receivedBuffers = [];
//           return stream.close();
//         });
//     } else {
//       console.log('file cannot be received completely');
//     }
//   } catch (err) {
//     console.log('File transfer failed');
//   }
// };
>>>>>>> 138cc7b2faa641a3aa65fcf89a283d5200db5ee5

export default TurnOnHotspot;