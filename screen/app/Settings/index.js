import React from 'react';
import {
  View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Local Import
import S from './style';
import GeolocationService from '../../../service/GeolocationService';
import Button from '../../../components/Button';
import {
  randomiseUser, 
  generateUser, 
  clearUser,
  logoutJade,
} from '../../../service/Debug';

class SettingScreen extends React.Component {
  handleLogout = async () => {
    const id = await SecureStore.getItemAsync('eToken');
    const logout = await GeolocationService.logout(id);

    if (logout._id) {
      await SecureStore.setItemAsync('eToken', '');
      this.props.navigation.navigate("AuthLoading");
    }
  }

  render() {
    return(
      <View style={S.container}>

        <View style={S.logoutBtn}>

          <Button
            label="Logout"
            onPress={this.handleLogout}
          />

        </View>

        <View style={S.debugBtn}>

          <Button
            label="Debug"
            onPress={() => this.props.navigation.navigate("Debug")}
          />

        </View>

      </View>
    )
  }
}

// Export
export default SettingScreen;