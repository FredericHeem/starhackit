
export default function(actions){
  const authMiddleware = store => next => action => {
    //console.log('action.type: ', action.type)
    switch(action.type){
      case actions.login.ok.getType():
        console.log('actions.login.ok: ', action.payload);
        //Save token
        break;
      case actions.login.error.getType():
        console.log('actions.login.error')
        break;
      default:
    }
    return next(action)
  }
  return authMiddleware;
}
