/**
 * Sample React Native macOS App
 * https://github.com/ptmt/react-native-macos
 */
import React, {Component} from 'react';
import ReactNative from 'react-native-macos';

const {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
} = ReactNative;


var apikey = "ShSWHAJHYOViZKYIgddh8QkXy3I3";

class Matches extends Component {

    constructor(props) {
        super(props);
        this.state = {matches: []};

        this.updateMatches();

        // Toggle the state every second
        setInterval(() => {
            this.updateMatches();
        }, 30 * 1000);

        this.updateMatch.bind(this);
    }

    updateMatches() {
        fetchMatches().then((response) => {
            console.log("Called");
            this.setState({matches: response.data});
        });
    }


    updateMatch(match_id) {
        fetchMatchDetails(match_id).then((response) => {
            console.log(response);
        });

    }

    renderMatches(matches) {
        let self = this;
        return matches.map(function (match, i) {
            return (
                <View key={i} style={styles.match}>
                    <Button onClick={() => self.updateMatch(match.unique_id)}
                            style={{width: 100, alignSelf: 'flex-end', margin: 10}} title={'View Score'}
                            bezelStyle={'inline'}/>

                    <Text numberOfLines={1} style={styles.text}>{match.title}</Text>
                </View>

            );
        });

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>List Matches</Text>
                {this.renderMatches(this.state.matches)}
            </View>
        )
    }
}


class Match extends Component {

    constructor(props) {
        super(props);
        this.state = {matches: []};

        this.updateMatches();

        // Toggle the state every second
        setInterval(() => {
            this.updateMatches();
        }, 30 * 1000);

        this.updateMatch.bind(this);
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    text: {
        fontSize: 14,
        marginTop: 15,
    },
    match: {
        backgroundColor: '#ef553a',
        width: 800,
        height: 50,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderBottomColor: '#F5FCFF',
        borderBottomWidth: 3,
        borderRadius: 10,
    },
});


AppRegistry.registerComponent('CricketScore', () => Matches);


function fetchMatches() {
    return fetch('http://cricapi.com/api/cricket/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apikey: apikey,
        })
    }).then((response) => {
        return response.json()
    });
}

function fetchMatchDetails(match_id) {
    return fetch('http://cricapi.com/api/cricketScore/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apikey: apikey,
            unique_id: match_id,
        })
    }).then((response) => {
        return response.json()
    });
}

