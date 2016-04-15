import { connect } from 'react-redux';
import actions from '../actions';
import ForgotView from '../views/forgot';

const mapStateToProps = () => ({});

export default connect(mapStateToProps, actions)(ForgotView)
