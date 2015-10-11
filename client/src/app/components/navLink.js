import React from 'react';
import cx from 'classnames';
import {Link, History} from 'react-router';


export default React.createClass( {

    mixins: [
        History
    ],

    activeClassForTo( pathname) {
        return cx( { active: this.history.isActive(pathname) } );
    },

    render() {
        return (
          <li className={this.activeClassForTo(this.props.to)}><Link {...this.props}>{this.props.children}</Link></li>
        );
    }

} );
