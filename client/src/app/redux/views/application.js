import { connect } from 'react-redux';
import AppView from 'views/application';

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps, {})(AppView)
