import React, { Component } from "react";

export default class DelayUnmount extends Component {
  state = {
    current: null
  };

  componentWillMount() {
    this.setState({ current: this.props.component });
  }

  componentDidMount() {
    this.nodeCurrentRect = this.nodeCurrent.firstChild.getBoundingClientRect();
  }

  componentWillReceiveProps(nextProps) {
    const { state } = this;
    const nextComponent = nextProps.component;
    if (nextComponent !== state.current) {
      this.saveNode(this.nodeCurrent);
      this.setState({ current: nextComponent });
    }
  }

  componentWillUnmount() {
    this.saveNode(this.nodeCurrent, true);
  }

  saveNode(node, removal) {
    if (node && node.innerHTML) {
      const nodeCloned = node.cloneNode(true);

      let rect = node.firstChild.getBoundingClientRect();
      if (rect.width === 0) {
        rect = this.nodeCurrentRect;
      }
      nodeCloned.style.left = `${rect.left}px`;
      nodeCloned.style.top = `${rect.top}px`;
      nodeCloned.style.animation = this.props.animationHide;
      nodeCloned.style.position = "fixed";
      if (removal) {
        document.body.appendChild(nodeCloned);
      } else {
        node.insertAdjacentElement("afterend", nodeCloned);
      }

      nodeCloned.addEventListener("animationend", () =>
        nodeCloned.parentNode.removeChild(nodeCloned)
      );
    }
  }
  render() {
    const { state } = this;
    const me = this;
    return (
      <div
        ref={node => {
          if (node && node.innerHTML) {
            node.style.animation = this.props.animationShow;
            const animationBeginHandler = () => {
              node.removeEventListener("animationend", animationBeginHandler);
              node.style.animation = "";
            };

            node.addEventListener("animationend", animationBeginHandler);
            me.nodeCurrent = node;
          }
        }}
      >
        {state.current}
      </div>
    );
  }
}
