import { connect } from 'react-redux';
import actions from '../actions';
import LoginView from '../views/login';

const mapStateToProps = (state) => {
    return {
        authenticated: state.get('auth').get('authenticated'),
        login: state.get('login').toJSON()
    }
};

export default connect(mapStateToProps, actions)(LoginView)
