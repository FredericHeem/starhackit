import { connect } from 'react-redux';
import { profileGet, profileUpdate } from '../modules/profile'
import MyProfileView from 'views/myProfile';

const mapStateToProps = (state) => {
  return {
    profile: state.get('profile').toJS()
  };
}

export default connect((mapStateToProps), {
    profileGet,
    profileUpdate
})(MyProfileView)
