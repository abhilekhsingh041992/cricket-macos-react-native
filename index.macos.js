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
    ActivityIndicator,
    ScrollView,
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
            this.setState({matches: response.data.reverse()});
        });
    }


    updateMatch(match_id) {
        this.setState({matchData: null});
        fetchMatchDetails(match_id).then((response) => {
            console.log(response);
            this.setState({matchData: response});
        });
    }

    renderMatches(matches) {
        let self = this;
        return matches.map(function (match, i) {
            return (
                <TouchableOpacity key={i} onPress={() => self.updateMatch(match.unique_id)}>
                    <View  style={styles.match}>
                        {/*<Button onClick={() => self.updateMatch(match.unique_id)}*/}
                        {/*style={{width: 100, alignSelf: 'flex-end', margin: 10}} title={'View Score'}*/}
                        {/*bezelStyle={'inline'}/>*/}
                        <Text style={styles.text}>{match.title}</Text>
                    </View>
                </TouchableOpacity>
            );
        });

    }


    renderMatch() {
        let match = this.state.matchData;
        if (match) {
            return (

                <View style={styles.sideView}>
                    <View style={block.container}>
                        <View style={block.titleContainer}>
                            <Text style={block.titleText}>
                                {match['team-1']} vs {match['team-2']}
                            </Text>

                        </View>
                        <View style={block.children}>
                            <Text style={block.descriptionText}> {match.type} Match </Text>
                            <Text style={block.descriptionText}> Description: {match['innings-requirement']} </Text>
                            <Text style={block.descriptionText}> Score: {match.score} </Text>
                        </View>
                    </View>
                </View>

            )
        } else {
            return (
                <View style={styles.sideView}>
                    <ActivityIndicator
                        color="#0000ff"
                        animating={this.state.animating}
                        style={[styles.centering, { alignItems: 'center',
                            justifyContent: 'center',
                            padding: 8,height: 80}]}
                        size="large"
                    />
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<Text style={styles.welcome}>List Matches</Text>*/}

                <ScrollView style={styles.sideBar} automaticallyAdjustContentInsets={false}>
                    {this.renderMatches(this.state.matches)}
                </ScrollView>

                {this.renderMatch()}
            </View>
        )
    }
}


class Match extends Component {

    constructor(props) {
        super(props);
        this.state = {matches: [], matchId: 0, matchData: null};

        this.updateMatches();

        // Toggle the state every second
        setInterval(() => {
            this.updateMatches();
        }, 30 * 1000);


        setInterval(() => {
            this.updateMatch(this.state.matchId);
        }, 10 * 1000);

        this.updateMatch.bind(this);
    }

}


const styles = StyleSheet.create({
    container: {
        // justifyContent: 'space-between',
        flexDirection: 'row',
        flex:1,
        backgroundColor: '#F5FCFF',
    },
    sideBar: {
        //width: 300,
        //alignItems: 'flex-start',
        padding: 0,
    },
    sideView: {
        width: 800,
        flex:1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#eee',
        padding: 50,
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
        fontSize: 16,
        flex: 1,
        flexWrap: 'wrap',
        fontFamily: 'Cochin',
    },
    match: {
        backgroundColor: '#fafbfc',
        width: 440,
        height: 80,
        padding: 20,
        flexDirection: 'row',
        borderBottomColor: '#e1e4e8',
        borderBottomWidth: 2,
        borderRightColor: '#e1e4e8',
        borderRightWidth: 2,
    },
});


const block = StyleSheet.create({
    container: {
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        backgroundColor: '#ffffff',
        margin: 10,
        height: 500,
        marginVertical: 5,
        overflow: 'hidden',
    },
    titleContainer: {
        borderBottomWidth: 0.5,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 2.5,
        borderBottomColor: '#d6d7da',
        backgroundColor: '#f6f7f8',
        paddingTop: 10,
        height: 40,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: 14,
    },
    disclosure: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
    },
    disclosureIcon: {
        width: 12,
        height: 8,
    },
    children: {
        margin: 10,
    }
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

