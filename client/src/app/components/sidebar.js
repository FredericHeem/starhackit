import React from 'react';
import {stack as Menu} from 'react-burger-menu';
import {Link} from 'react-router';
import Radium from 'radium';

let RadiumLink = Radium(Link);

export default React.createClass({
    render: function() {
        return (
            <Menu right>
                <RadiumLink className="menu-item" to="/app/">Dashboard</RadiumLink>
                <RadiumLink className="menu-item" to="/logout">Logout</RadiumLink>
            </Menu>
        );
    }

});
