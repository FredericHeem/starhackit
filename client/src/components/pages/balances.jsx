"use strict";
var React = require("react");
var connect = require("local/libraries/tmp_connect");
var DocumentTitle = require("local/components/core/documentTitle.jsx");
var ImmutableRenderMixin = require("react-immutable-render-mixin");
var componentTransitionMixin = require("local/mixins/componentTransition");
var balancesStore = require("local/stores/balances");
var ReactSpinner = require("react-spinner");

var Balances = React.createClass({
  mixins: [
    connect(balancesStore, "balances"),
    componentTransitionMixin("balances"),
    ImmutableRenderMixin
  ],
  render: function() {
    //var view = this;
    //console.log("Balances render     ", this.state.toString())
    //console.log("Balances render  ", this.state.balances)
    
    //console.log("Balances render ", this.state.get("balances"))
    var balancesView = <ReactSpinner/>;
    if(this.state.balances.size){
      balancesView = this.state.balances.map(function(balance){
        //  console.log("balance ",balance.toString());
        //console.log("balance ",balance.get('balance'));
        console.log("currency ",balance.get('currency'));
        return (<div>{balance.get('balance')} {balance.get('currency')}</div>)
      }).toJS();
    }
    return (
      <DocumentTitle title="Balances">
        <div>
          <h1>Balances</h1>
          <div>{balancesView}</div>
        </div>
      </DocumentTitle>
    );
  }
});
module.exports = Balances;
