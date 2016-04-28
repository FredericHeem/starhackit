import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import MyProfileView from '../views/myProfile';

const mapStateToProps = (state) => {
  return {
    profile: state.get('profile').toJS(),
    profileUpdate: state.get('profileUpdate').toJS()
  };
}

export default function(actions){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return connect(mapStateToProps, mapDispatchToProps)(MyProfileView);
}
