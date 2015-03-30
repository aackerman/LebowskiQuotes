var React = require('react-native');

var {
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var Button = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    children: React.PropTypes.string.isRequired
  },

  render() {
    var styles = StyleSheet.create({
      button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#EFEFEF',
        ...this.props.style
      }
    });

    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor='#CFCFCF'
        onPress={this.props.onClick}>
        <Text style={{textAlign: 'center'}}>{this.props.children}</Text>
      </TouchableHighlight>
    )
  }
});

module.exports = Button;
