// https://github.com/prateekbh/preact-async-route/blob/master/src/index.js
import { createElement as h, Component } from "react";

class AsyncRoute extends Component {
  constructor() {
    super();
    this.state = {
      componentData: null,
      error: null
    };
  }

  componentDidMount() {
    this.loadComponent();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.url && this.props.url !== nextProps.url) {
      this.setState(
        {
          componentData: null
        },
        () => {
          this.loadComponent();
        }
      );
    }
  }

  loadComponent() {
    if (this.props.component) {
      return this.setState({
        componentData: this.props.component
      });
    }
    const componentData = this.props.getComponent(
      this.props.url,
      ({ component }) => {
        // Named param for making callback future proof
        if (component) {
          this.setState({
            componentData: component
          });
        }
      }
    );

    // In case returned value was a promise
    if (componentData && componentData.then) {
      // IIFE to check if a later ending promise was creating a race condition
      // Check test case for more info
      (url => {
        componentData.then(component => {
          if (url === this.props.url) {
            this.setState({
              componentData: component
            });
          }
          return true;
        }).catch(e => {
            this.setState({
              error: e
            });
        });
      })(this.props.url);
    }
  }
  render() {
    if (this.state.componentData) {
      return h(this.state.componentData, this.props);
    } else if (this.props.loading) {
      const loadingComponent = this.props.loading();
      return loadingComponent;
    }
    return null;
  }
}

export default AsyncRoute;
