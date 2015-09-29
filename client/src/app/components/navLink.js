import React from 'react';
import cx from 'classnames';
import {Link, State} from 'react-router';


export default React.createClass( {

    mixins: [
        State
    ],

    activeClassForTo( to ) {
        return cx( { active: this.isActive( to ) } );
    },

    render() {
        return (
          <li className={this.activeClassForTo(this.props.to)}><Link {...this.props}>{this.props.children}</Link></li>
        );
    }

} );