import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import RegistrationCompleteView from '../views/registrationComplete';

const mapStateToProps = (state) => state.get('registrationComplete').toJSON();

export default function(actions){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return connect(mapStateToProps, mapDispatchToProps)(RegistrationCompleteView);
}
