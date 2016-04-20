import _ from 'lodash';
import React from 'react';
import Debug from 'debug';
let debug = new Debug("components:identities");
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

let CertifierComponent = React.createClass({
    propTypes: {
        certifier: React.PropTypes.object,
        certifationRequest: React.PropTypes.func
    },
    getDefaultProps(){
        return {
            certifier: {}
        }
    },
    render() {
        let {certifier} = this.props;
        debug('render certifiers', certifier)
        return (
            <ListItem>
                {certifier.name}
            </ListItem>
        )
    }
});

export default React.createClass({
    propTypes: {
        certifiers: React.PropTypes.array,
        certificationRequest: React.PropTypes.func.isRequired
    },
    getDefaultProps(){
        return {
            loading: false,
            certifiers: []
        }
    },

    render() {
        let {props} = this;
        return (
            <div>

            <form
                className="form-horizontal"
                onSubmit={ (e) => e.preventDefault() }>
                <h2>Select you identity certifier</h2>
                <List>
                    {_.map(props.certifiers, (certifier, key) => {
                        return <CertifierComponent key={key} certifier={certifier}/>
                    })}
                </List>
            </form>
            </div>
        );
    },
    onNewIdentiy() {
        debug('onCertifationRequest');
        this.props.certifationRequest();
    }
} );
