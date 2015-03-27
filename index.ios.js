'use strict';

var React = require('react-native');
var Adapter = require('./adapter');
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
    alignItems: 'center'
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
    });
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
        <Text>
          Loading Quotes...
        </Text>
      </View>
    );
  },

  renderLine(line) {
    let DUDE = 'The Dude';

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
      'The Stranger': 'http://1.bp.blogspot.com/-nCrgPeZvo2c/TiNvBaSvPdI/AAAAAAAAALY/L40Ju5ERhuo/s1600/BigLebowski_145Pyxurz.jpg',
      'Walter': 'http://blog.tomgrover.net/wp-content/uploads/2010/04/walter.jpg',
      'Donny': 'http://viralcircus.com/wp-content/uploads/2014/01/3xsGO4m.jpg',
      'Brandt': 'http://content6.flixster.com/question/37/32/66/3732668_std.jpg',
      'Blonde Thug': 'http://www.aviewfromtheedge.net/lost2010/wp-content/uploads/2010/01/MarkPellegrinoLOST2.jpg',
      'Woo': 'http://media.schadenfreude.net/2009/10/lebowskirug.jpg',
      'Kieffer': '',
      'Maude Lebowski': '',
      'Younger Cop': '',
      'Uli Kunkel': 'http://content7.flixster.com/question/45/71/76/4571761_std.jpg',
      'Bunny': 'http://www.btchflcks.com/wp-content/uploads/2013/10/62.jpg',
      'Lebowski': 'http://students.greshamhs.org/10/osheam/lebowski/jeffrey-lebowski1.jpg',
      'The Dude': 'http://vignette3.wikia.nocookie.net/thebiglebowski/images/7/7e/The_Dude.jpeg/revision/latest?cb=20111216183045'
    };

    return (
      <View style={{paddingBottom: 10, paddingLeft: 5, paddingRight: 5}}>
        <View key={line.id} style={{paddingBottom: 3}}>
          <View style={{ borderRadius: 10, backgroundColor: messageBackgroundColor, padding: 8, alignSelf: alignment }}>
            <Text style={{textAlign: 'left', color: messageTextColor}}>{line.text}</Text>
          </View>
        </View>
        <Image
          style={styles.icon}
          source={{uri: characters[line.character.name]}} />
      </View>
    );
  },

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else {
      return (
        <View>
          <ScrollView style={{paddingTop: 20}} scrollEnabled={true}>
            {this.state.lines.map(this.renderLine)}
            <View style={styles.container}>
              <Button onClick={this.getRandomQuote}>Get random quote</Button>
              <Button onClick={this.getNextQuote}>Get next quote</Button>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
});

var Button = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    children: React.PropTypes.string.isRequired
  },

  render() {
    var styles = {
      button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#EFEFEF'
      }
    };

    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor='#EFEFEF'
        onPress={this.props.onClick}>
        <Text>{this.props.children}</Text>
      </TouchableHighlight>
    )
  }
});

AppRegistry.registerComponent('LebowskiQuotes', () => LebowskiQuotes);