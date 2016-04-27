import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import ResetPasswordView from '../views/resetPassword';

const mapStateToProps = (state) => state.get('requestPasswordReset').toJSON();

export default function(actions){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return connect(mapStateToProps, mapDispatchToProps)(ResetPasswordView);
}
