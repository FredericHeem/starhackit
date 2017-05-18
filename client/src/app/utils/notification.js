import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';

export default () => {
  const config = {
    position: 'top-right',
    effect: 'scale',
    timeout: 10e3,
    offset: 100,
  };

  return {
    error(message) {
      return Alert.error(message, config);
    },
    info(message) {
      return Alert.info(message, config);
    },
  };
};
