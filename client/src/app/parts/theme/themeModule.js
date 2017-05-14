import { connect } from 'react-redux';

export default function(context) {
  const ThemeView = require('./ThemeView').default(context);

  function Containers() {
    return {
      theme() {
        const mapStateToProps = () => ({});
        return connect(mapStateToProps)(ThemeView);
      },
    };
  }

  function Routes(containers) {
    return {
      childRoutes: [
        {
          path: 'view',
          component: containers.theme(),
        },
      ],
    };
  }

  const containers = Containers(context);
  return {
    containers,
    routes: () => /*store*/ Routes(containers),
  };
}
