import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import LogoutView from '../views/logout';

const mapStateToProps = (state) => state.get('logout').toJSON()

export default function(actions){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return connect(mapStateToProps, mapDispatchToProps)(LogoutView);
}
