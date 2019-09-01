/** @jsx jsx */
import { useEffect, useState, createElement as h } from "react";

export default () =>
  function AsyncRoute({ getComponent, loading, error, ...props }) {
    const [component, setComponent] = useState(null);
    const [errorDisplay, setError] = useState(null);

    useEffect(() => {
      getComponent(
        component => setComponent(() => component),
        error => setError(error)
      );
    }, []);
    if (errorDisplay) {
      return error(errorDisplay);
    }
    if (component) {
      return h(component, props);
    }
    if (loading) {
      return loading();
    }
    return null;
  };
