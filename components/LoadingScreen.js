import React from 'react';
import { 
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';

const S = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default class LoadingScreen extends React.Component {
    render() {
        return(
            <View style={S.container}>
                <ActivityIndicator 
                    size="large"
                    color="#00a8ff"
                />
            </View>
        )
    }
}