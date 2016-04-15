import { connect } from 'react-redux';
import actions from '../actions';
import SignupView from '../views/signup';

const mapStateToProps = (state) => state.get('signup').toJSON();

export default connect(mapStateToProps, actions)(SignupView)
