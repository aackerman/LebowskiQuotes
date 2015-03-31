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
    if (line.character.name == DUDE) {
      alignment = 'flex-start';
      messageBackgroundColor = '#E5E4E9';
      messageTextColor= '#000000';
    } else {
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
      }
    };

    var characters = {
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
      // 'The Jesus': 'http://www.nientepopcorn.it/wp-content/uploads/2014/11/il_grande_lebowski_torna_al_cinema_00_jesus.jpg',
      // 'Uli Kunkel': 'http://content7.flixster.com/question/45/71/76/4571761_std.jpg',
      // 'Bunny': 'http://www.btchflcks.com/wp-content/uploads/2013/10/62.jpg',
      // 'Lebowski': 'http://students.greshamhs.org/10/osheam/lebowski/jeffrey-lebowski1.jpg',
    };

    if (characters[line.character.name] === undefined) {
      throw new Error('Missing image for ' + line.character.name);
    }

    return (
      <View style={{paddingBottom: 10, paddingLeft: 5, paddingRight: 5}}>
        <View key={line.id} style={{paddingBottom: 3}}>
          <View style={{ borderRadius: 10, backgroundColor: messageBackgroundColor, padding: 8, alignSelf: alignment }}>
            <Text style={{textAlign: 'left', color: messageTextColor}}>{line.text}</Text>
          </View>
        </View>
        <Image
          style={styles.icon}
          source={characters[line.character.name]} />
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
