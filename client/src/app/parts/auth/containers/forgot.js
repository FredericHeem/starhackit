import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import ForgotView from '../views/forgot';

const mapStateToProps = () => ({});

export default function(actions){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return connect(mapStateToProps, mapDispatchToProps)(ForgotView);
}
