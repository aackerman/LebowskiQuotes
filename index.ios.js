'use strict';

var React = require('react-native');
var Adapter = require('./adapter');
var Button = require('./button');
var {
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight
} = React;

var rest = new Adapter({
  host: 'http://lebowski.me',
  namespace: 'api'
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  }
});

var LebowskiQuotes = React.createClass({
  getInitialState() {
    return {
      lines: [],
      loaded: false
    };
  },

  getQuote(id) {
    rest.find('quotes', id).then((res) => {
      this.setState({
        quote: res.quote,
        lines: res.quote.lines,
        loaded: true
      });
    }).catch((err) => {
      console.log(err);
    }).catch((err) => {
      console.log(err);
    });
  },

  getPrevQuote() {
    this.getQuote(this.state.quote.id - 1);
  },

  getNextQuote() {
    this.getQuote(this.state.quote.id + 1);
  },

  getRandomQuote() {
    this.getQuote('random');
  },

  componentDidMount() {
    this.getRandomQuote();
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>Loading Quotes...</Text>
      </View>
    );
  },

  renderLine(line) {
    var DUDE = 'The Dude';

    var alignment;
    var messageBackgroundColor;
    var messageTextColor;
    var imageOnLeft;
    if (line.character.name == DUDE) {
      imageOnLeft = true;
      alignment = 'flex-start';
      messageBackgroundColor = '#E5E4E9';
      messageTextColor= '#000000';
    } else {
      imageOnLeft = false;
      alignment = 'flex-end';
      messageTextColor= '#FFFFFF';
      messageBackgroundColor = '#2095FE';
    }

    var styles = {
      icon: {
        width: 50,
        height: 50,
        borderRadius: 5,
        alignSelf: alignment
      },
      characterName: {
        flex: 1,
        margin: 5,
        marginTop: 15,
        textAlign: imageOnLeft ? 'left' : 'right',
        alignSelf: 'stretch',
        backgroundColor: '#FFFFFF',
        color: '#000000'
      }
    };

    var characters = {
      'Franz': require('image!franz'),
      'Policeman': require('image!policeman'),
      'George Bush': require('image!george_bush'),
      'Donnelly': require('image!donnelly'),
      'Tony': require('image!tony'),
      'Jackie Treehorn': require('image!jackie_treehorn'),
      'Da Fino': require('image!da_fino'),
      'Pilar': require('image!pilar'),
      'Bunny': require('image!bunny'),
      'Cab Driver': require('image!tony'),
      'Fred Dynarski': { uri: undefined },
      'Gary': { uri: undefined },
      'Corvette Owner': require('image!corvette_owner'),
      'Waitress': require('image!waitress'),
      'Doctor': require('image!doctor'),
      'The Stranger': require('image!the_stranger'),
      'Walter': require('image!walter'),
      'Donny': require('image!donny'),
      'Brandt': require('image!brandt'),
      'Blonde Thug': require('image!blonde_thug'),
      'Woo': require('image!woo'),
      'Kieffer': require('image!kieffer'),
      'Maude Lebowski': require('image!maude_lebowski'),
      'Marty': require('image!marty'),
      'Police Chief of Malibu': require('image!police_chief_of_malibu'),
      'Smokey': require('image!smokey'),
      'The Dude': require('image!the_dude'),
      'Younger Cop': require('image!younger_cop'),
      'Older Cop': require('image!older_cop'),
      'The Jesus': require('image!the_jesus'),
      'Uli Kunkel': require('image!uli_kunkel'),
      'Lebowski': require('image!lebowski'),
    };

    if (characters[line.character.name] === undefined) {
      console.warn('Missing image for ' + line.character.name);
    }

    var characterName =
      <Text style={styles.characterName}>
        {line.character.name}
      </Text>

    return (
      <View style={{paddingBottom: 10, paddingLeft: 5, paddingRight: 5}}>
        <View key={line.id} style={{paddingBottom: 3}}>
          <View style={{ borderRadius: 10, backgroundColor: messageBackgroundColor, padding: 8, alignSelf: alignment }}>
            <Text style={{textAlign: 'left', color: messageTextColor}}>{line.text}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {!imageOnLeft && characterName}
          <Image
            style={styles.icon}
            source={characters[line.character.name]} />
          {imageOnLeft && characterName}
        </View>
      </View>
    );
  },

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else {
      return (
        <ScrollView style={{paddingTop: 20, marginBottom: 20}} scrollEnabled={true}>
          {this.state.lines.map(this.renderLine)}
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Button style={{flex: 1, alignSelf: 'flex-start', margin: 3}} onClick={this.getPrevQuote}>Previous</Button>
            <Button style={{flex: 1, alignSelf: 'center', margin: 3}} onClick={this.getRandomQuote}>Random</Button>
            <Button style={{flex: 1, alignSelf: 'flex-end', margin: 3}} onClick={this.getNextQuote}>Next</Button>
          </View>
        </ScrollView>
      );
    }
  }
});

AppRegistry.registerComponent('LebowskiQuotes', () => LebowskiQuotes);
