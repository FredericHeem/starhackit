import { connect } from 'react-redux';
import AppView from 'views/application';

const mapStateToProps = (state) => {
  return {
    authenticated: state.get('auth').get('authenticated')
  };
}

export default connect(mapStateToProps, {})(AppView)
