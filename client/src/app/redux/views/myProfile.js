import { connect } from 'react-redux';
import { profileGet, profileUpdate } from '../modules/profile'
import MyProfileView from 'views/myProfile';

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect((mapStateToProps), {
    profileGet,
    profileUpdate
})(MyProfileView)
