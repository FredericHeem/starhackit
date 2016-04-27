import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import AppView from '../views/application';

const mapStateToProps = (state) => {
  return {
    authenticated: state.get('auth').get('authenticated')
  };
}

export default function(actions){
    return connect(mapStateToProps, actions)(AppView)
}
