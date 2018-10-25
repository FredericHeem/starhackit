// https://github.com/prateekbh/preact-async-route/blob/master/src/index.js
import React, { createElement as h, Component } from "react";

export default ({ tr }) => class AsyncRoute extends Component {
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
      const {url} = this.props;
      if (url && url !== nextProps.url) {
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
      const {component, url, getComponent} = this.props;
      if (component) {
        return this.setState({
          componentData: component
        });
      }
      const componentData = getComponent(
        url,
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
        (newUrl => {
          componentData
            .then(component => {
              if (newUrl === url) {
                this.setState({
                  componentData: component
                });
              }
              return true;
            })
            .catch(e => {
              this.setState({
                error: e
              });
            });
        })(url);
      }
    }

    render() {
      const {error, componentData} = this.state;
      const {loading} = this.props;
      if (error) {
        return (
          <div>
            <h3>{tr.t("Error loading component")}</h3>
            <p>{error.toString()}</p>
          </div>
        );
      } if (componentData) {
        return h(componentData, this.props);
      } if (loading) {
        const loadingComponent = loading();
        return loadingComponent;
      }
      return null;
    }
  };
