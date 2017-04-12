import Debug from 'debug';

export default function({enable}) {
  console.log("LOG ", enable);
  if(enable){
    Debug.enable("*,-engine*,-sockjs-client*,-socket*");
  } else {
    Debug.disable("*");
  }
}