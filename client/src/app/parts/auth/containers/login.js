import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import LoginView from '../views/login';

const mapStateToProps = (state) => {
    return {
        authenticated: state.get('auth').get('authenticated'),
        login: state.get('login').toJSON()
    }
};

export default function(actions){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return connect(mapStateToProps, mapDispatchToProps)(LoginView);
}
