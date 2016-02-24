import { connect } from 'react-redux';
import { signup } from '../modules/signup'
import SignupView from 'views/signup';

const mapStateToProps = (state) => {
  return {
    registerCompleted: state.signup.registerCompleted
  };
}
export default connect(mapStateToProps, {
  signup
})(SignupView)
