import React, { Component } from "react";

export default class DelayUnmount extends Component {
  state = {
    previous: null,
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
      this.setState({ previous: state.current, current: nextComponent });
    }
  }

  componentWillUnmount() {
    const { nodeCurrent } = this;
    if (nodeCurrent) {
      const nodeCloned = nodeCurrent.parentNode.cloneNode(true);
      nodeCloned.style.position = "fixed";
      const rect = this.nodeCurrentRect;
      nodeCloned.style.left = `${rect.left}px`;
      nodeCloned.style.top = `${rect.top}px`;
      document.body.appendChild(nodeCloned);
      this.saveNode(nodeCloned);
    }
  }

  saveNode(node) {
    if (node && node.innerHTML) {
      node.style.display = "block";
      node.style.animation = this.props.animationHide;

      const animationEndHandler = () => {
        node.removeEventListener("animationend", animationEndHandler);
        node.style.display = "none";
        node.style.animation = "";
      };

      node.addEventListener("animationend", animationEndHandler);
    }
  }
  render() {
    const { state } = this;
    const me = this;
    return (
      <div className="animate">
        <div
          ref={node => {
            this.saveNode(node);
          }}
          style={{ position: "absolute" }}
        >
          {state.previous}
        </div>
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
      </div>
    );
  }
}
