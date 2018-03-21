import React, { Component } from "react";
import {View} from "react-native"

export default class Lifecycle extends Component {
  componentWillMount() {
    const { willMount } = this.props;
    willMount && willMount(this.props);
  }
  componentDidMount() {
    const { didMount } = this.props;
    didMount && didMount(this.props, this.divDom);
  }
  componentWillUpdate(nextProps) {
    const { willUpdate } = this.props;
    willUpdate && willUpdate(this.props, this.divDom);
  }
  
  componentDidUpdate() {
    const { didUpdate } = this.props;
    didUpdate && didUpdate(this.props, this.divDom);
  }
  componentWillUnmount() {
    const { willUnmount } = this.props;
    willUnmount && willUnmount(this.props, this.divDom);
  }
  render() {
    return (
      <View
        className={this.props.className}
        ref={divDom => {
          this.divDom = divDom;
        }}
      >
        {this.props.children}
      </View>
    );
  }
}