import { connect } from 'react-redux';
import { login } from '../modules/auth'
import LoginView from 'views/login';

const mapStateToProps = (state) => {
  //debug(`mapStateToProps `, state)
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect((mapStateToProps), {
  login
})(LoginView)
