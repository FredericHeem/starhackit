import { connect } from 'react-redux'
import { logout } from '../modules/auth'
import LogoutView from 'views/logout';

const mapStateToProps = () => ({});

export default connect((mapStateToProps), {
    logout
})(LogoutView)
