import React from 'react';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MenuItem from 'material-ui/lib/menus/menu-item';

import Debug from 'debug';
let debug = new Debug("components:selectLanguage");

/* eslint camelcase: 0 */
import {
    Icon_Flag_DE,
    Icon_Flag_FR,
    Icon_Flag_IN,
    Icon_Flag_US
} from 'material-ui-country-flags';

const LanguageCodeToIcon = {
    US: (<Icon_Flag_US/>),
    FR: (<Icon_Flag_FR/>),
    IN: (<Icon_Flag_IN/>),
    DE: (<Icon_Flag_DE/>)
};

function getIcon(code){
    return (
        <div>
            {LanguageCodeToIcon[code]}
        </div>
    );
}

export default React.createClass({
    propTypes: {
        language: React.PropTypes.string.isRequired,
        onLanguage: React.PropTypes.func.isRequired
    },

    _handleOnItemTouchTap(e, item) {
        debug('Choose language: ' + item.key);
        this.props.onLanguage(item.key);
    },
    render() {
        debug('render:', this.props);
        return (
            <IconMenu key="top-language"
              anchorOrigin={ { vertical: "bottom", horizontal: "right" } }
              onItemTouchTap={ this._handleOnItemTouchTap }
              iconButtonElement={
                <IconButton>{getIcon(this.props.language)}</IconButton>
              }
            >
              <MenuItem style={ { backgroundColor: '#f5f5f5' } } key="US" checked={ true } primaryText="English" />
              <MenuItem style={ { backgroundColor: '#f5f5f5' } } key="DE" leftIcon={ <Icon_Flag_DE /> } primaryText="Deutsch" />
              <MenuItem style={ { backgroundColor: '#f5f5f5' } } key="FR" leftIcon={ <Icon_Flag_FR /> } primaryText="Français" />
              <MenuItem style={ { backgroundColor: '#f5f5f5' } } key="IN" leftIcon={ <Icon_Flag_IN /> } primaryText="मानक हिन्दी" />
            </IconMenu>
        );
    }
});
