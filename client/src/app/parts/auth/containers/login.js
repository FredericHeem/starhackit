import { connect } from 'react-redux';
import { login } from '../reducers/auth'
import LoginView from '../views/login';

const mapStateToProps = (state) => {
  return {
    authenticated: state.get('auth').get('authenticated')
  };
}

export default connect((mapStateToProps), {
  login
})(LoginView)
