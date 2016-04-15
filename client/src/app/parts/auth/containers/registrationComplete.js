import { connect } from 'react-redux';
import actions from '../actions';
import RegistrationCompleteView from '../views/registrationComplete';

const mapStateToProps = (state) => state.get('verifyEmailCode').toJSON();

export default connect(mapStateToProps, actions)(RegistrationCompleteView)
