import React from 'react'
import {Keyboard} from 'react-native'
import {TabBarBottom} from 'react-navigation'

/* This exists only to hide the bloody bottom tab bar when the keyboard is being used */
class TabBarComponent extends React.PureComponent {

  constructor(props) {
    super(props);

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);

    this.state = {
      isVisible: true
    }
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = event => {
    this.setState({
      isVisible: false
    })
  }

  keyboardWillHide = event => {
    this.setState({
      isVisible: true
    })
  }

  render() {
    return this.state.isVisible ?
      <TabBarBottom {...this.props} />
      :
      null
  }
}

export default TabBarComponent