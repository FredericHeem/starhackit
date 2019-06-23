import React, { createElement as h } from "react";

export default class ErrorBoundary extends React.Component {
  public state = { error: null, info: null };

  public componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error: error.toString(),
      info: JSON.stringify(info, null, 4)
    });
  }

  public render() {
    if (this.state.error) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <h3>{this.state.error}</h3>
          <h3>{this.state.info}</h3>
        </div>
      );
    }

    return this.props.children;
  }
}
