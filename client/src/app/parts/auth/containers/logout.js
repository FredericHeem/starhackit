import { connect } from 'react-redux'
import actions from '../actions';
import LogoutView from '../views/logout';

const mapStateToProps = (state) => state.get('logout').toJSON()

export default connect(mapStateToProps, actions)(LogoutView)
