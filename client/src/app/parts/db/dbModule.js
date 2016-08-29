import { browserHistory } from 'react-router';
import {bindActionCreators} from 'redux';
import {createAction} from 'redux-act';
import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import SchemaView from './SchemaView';

function Resources(rest){
  return {
    getSchema(data) {
        return rest.get(`db/schema`, data);
    }
  }
}

function Actions(rest){
    let schema = Resources(rest);
    return {
        selectTable: createAction("SELECT_TABLE"),
        getSchema: createActionAsync('SCHEMA_GET', schema.getSchema)
    }
}

function Reducers(actions){
  return {
    schema: createReducerAsync(actions.getSchema),
  }
}

function Containers(context, actions){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return {
      schema(){
          const mapStateToProps = (state) => ({schema: state.db.schema})
          return connect(mapStateToProps, mapDispatchToProps)(SchemaView);
      }
    }
}

function Routes(containers, store, actions){
    return {
      childRoutes : [
          {
              path: 'schema',
              component: containers.schema(),
              onEnter: () => store.dispatch(actions.getSchema())
          }
      ]
    }
}

function Middleware(actions){
  const middleware = () => next => action => {
    if(action.type === actions.selectTable.getType()){
      let tableName = action.payload;
      browserHistory.push(`/admin/db/table${tableName}`)
    }

    return next(action)
  }
  return middleware;
}

export default function({context, rest}) {
  let resources = Resources(rest)
  let actions = Actions(rest);
  let containers = Containers(context, actions, resources)
  return {
      actions,
      reducers: Reducers(actions),
      containers,
      routes: (store) => Routes(containers, store, actions),
      middlewares: [Middleware(actions)]
  }
}
