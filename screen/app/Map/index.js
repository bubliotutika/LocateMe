import React from 'react';
import {
  View,
  Text,
  Platform,
  AppState,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import CustomIcons from 'react-native-vector-icons/FontAwesome';
import * as SecureStore from 'expo-secure-store';

// Local Import
import S from './style';
import Color from '../../../styles/Color';
import MapStyle from './MapStyle';
import GeolocationService from '../../../service/GeolocationService';
import Slider from '../../../components/Slider';

class MapScreen extends React.Component {
  state = {
    users: [],
    userId: null,
    userPos: {
      lat: 0,
      lng: 0,
    },
    sliderValue: 2000,
    error: "",
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    },
  }

  location = null;

  componentDidMount = async () => {
    const {sliderValue} = this.state;
    const location = await GeolocationService.getPos();
    const users = await GeolocationService.getAll();

    users.push({
      _id: '123456789',
      lat: 48.85391,
      lng: 2.2913515,
      phoneNumber: "Tema la tour !"
    })

    AppState.addEventListener('change', this.handleAppStateChange);

    GeolocationService.setDistance(sliderValue);

    if (location.error) {
      this.setState({error: location.error});
    } else {
      this.setState({
        userId: await SecureStore.getItemAsync('eToken'),
        userPos: {
          lat: location.latitude,
          lng: location.longitude,
        },
        users: users || [],
        region: {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.15,
        }
      });
  
      this.updateMap();
    }
  }

  componentWillUnmount = () => {
    this.stopUpdateMap();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  getMarker = (user) => {
    const {userId} = this.state;
    let pinColor = Color.blue;

    if (user._id === userId) 
      pinColor = Color.darkOrange;
    if (user.phoneNumber === 'Tema la tour !')
      pinColor = Color.pink;

    return (
      <Marker 
        key={user._id}
        coordinate={{ 
          latitude: user.lat,
          longitude: user.lng, 
        }}
        title={user.phoneNumber}
        onPress={()=> this.props.navigation.navigate("AddContact", {...user})}
      >
        <CustomIcons name={user.phoneNumber === "Tema la tour !" ? "shield" : "street-view"} size={30} color={pinColor} />
      </Marker>
    )
  }

  updateMap = async () => {
    const {userId} = this.state;

    try {
      this.location = setInterval(async ()=>{
        const location = await GeolocationService.getPos();
  
        await GeolocationService.update({
          id: userId,
          lat: location.latitude,
          lng: location.longitude,
        });
  
        const users = await GeolocationService.getAll();
  
        // console.log('========================================');
        // const d = new Date();
        // console.log(`${d.getHours()}h:${d.getMinutes()}m:${d.getSeconds()}s ${d.getMilliseconds()}ms   Map update on "${Platform.OS}"`);
        // console.log('========================================');
        users.push({
          _id: '123456789',
          lat: 48.85391,
          lng: 2.2913515,
          phoneNumber: "Tema la tour !"
        })

        this.setState({
          users,
          userPos: {
            lat: location.latitude,
            lng: location.longitude,
          },
        });
      }, 10000);
    } catch (error) {
      const id = await SecureStore.getItemAsync('eToken');
      GeolocationService.logout(id);
      await SecureStore.setItemAsync('eToken', '');
      this.props.navigation.navigate("AuthLoading");
    }
  }

  stopUpdateMap = async () => {
    clearInterval(this.location);
  }

  handleSliderChange = (sliderValue) => {
    GeolocationService.setDistance(sliderValue);
    this.setState({sliderValue});
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      this.stopUpdateMap();
    } else if (nextAppState === 'active') {
      this.updateMap();
    }
  }

  onRegionChange = (region) => {
    this.setState({region});
  }

  render() {
    const {region, sliderValue, users, error, userPos} = this.state;

    if (error) {
      return (
        <View style={S.container}>
          <Text>{error}</Text>
        </View>
      )
    }
    
    return(
      <View style={S.container}>
        <View style={S.mapContainer}>
          <MapView
            style={S.map}
            provider={PROVIDER_GOOGLE}
            customMapStyle={MapStyle}
            region={region}
            onRegionChangeComplete={this.onRegionChange}
          >
            {
              users.map((user) => this.getMarker(user))
            }
            <Circle 
              center={{ 
                latitude: userPos.lat,
                longitude: userPos.lng, 
              }}
              radius={sliderValue}
              strokeWidth={1}
              strokeColor={`${Color.darkOrange}99`}
              fillColor={`${Color.orange}22`}
            />
          </MapView>
        </View>

        <View style={S.slider}>
          <Slider 
            minimumValue={0}
            maximumValue={250000}
            onValueChange={this.handleSliderChange}
            step={1000}
            minimumTrackTintColor={Color.darkOrange}
            maximumTrackTintColor={Color.lightGrey}
            thumbTintColor={Color.grey}
            value={sliderValue}
          />
        </View>
      </View>
    )
  }
}

// Export
export default MapScreen;