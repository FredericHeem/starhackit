import { connect } from 'react-redux';
import { requestPasswordReset } from '../reducers/auth'
import ForgotView from '../views/forgot';

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  requestPasswordReset
})(ForgotView)
