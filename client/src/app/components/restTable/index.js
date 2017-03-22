import restTableComponent from './restTableComponent';
import RestTableStore from './restTableStore';

export default function(context, {getData, columns}) {
  const store = RestTableStore(context, {getData})
  return {
    store,
    view: restTableComponent(context, store, {columns})
  }
}