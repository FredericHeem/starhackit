import { connect } from 'react-redux';
import { verifyEmailCode } from '../reducers/signup'
import RegistrationCompleteView from '../views/registrationComplete';

const mapStateToProps = (state) => {
  console.log('mapStateToProps', state.get('signup').get('emailCodeVerified'))
  return {
    emailCodeVerified: state.get('signup').get('emailCodeVerified')
  };
}
export default connect(mapStateToProps, {
  verifyEmailCode
})(RegistrationCompleteView)
