import { connect } from 'react-redux';
import { verifyEmailCode } from '../reducers/signup'
import RegistrationCompleteView from '../views/registrationComplete';

const mapStateToProps = (state) => {
  console.log('mapStateToProps', state.get('signup').toJSON())
  return state.get('signup').toJSON();
}
export default connect(mapStateToProps, {
  verifyEmailCode
})(RegistrationCompleteView)
