import _ from 'lodash';
import React from 'react';
import LaddaButton from 'react-ladda';
import tr from 'i18next';
import Debug from 'debug';
let debug = new Debug("components:identities");
import { Link } from 'react-router';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import FlatButton from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

let IdentityComponent = React.createClass({
    propTypes: {
        identity: React.PropTypes.object
    },
    getDefaultProps(){
        return {
        }
    },
    renderCertification(identity){
        if(!identity.certificates){
            return (<div>Not Certified</div>)
        } else {
        return (
                <div>Certified by: <strong>{_.map(identity.certificates, (certificate) => {return certificate.certifiedBy + " "})}</strong></div>
            )
        }

    },
    render() {
        let {identity} = this.props;
        debug('render IdentityComponent', identity)
        return (
            <ListItem>
            <Card
                className='flex-items'
                style={{
                }}>
              <CardTitle
                title={identity.idName}
              />
              <CardText>
                <List>
                    {_.map(identity.data, (data, key) => {
                        return <ListItem key={key}> {data.name}</ListItem>
                    })}
                </List>
              </CardText>
              <CardTitle>
                {this.renderCertification(identity)}
                <br></br>
                <div>
                    <RaisedButton
                              label="Request Certification"
                              containerElement={<Link to="/app/certif_request" />}
                              linkButton={true}
                            />
                </div>
              </CardTitle>
            </Card>
            </ListItem>
        )
    }
});

export default React.createClass({
    propTypes: {
        loading: React.PropTypes.bool,
        identities: React.PropTypes.array,
        identityNew: React.PropTypes.func.isRequired
    },
    getDefaultProps(){
        return {
            loading: false,
            identities: []
        }
    },

    render() {
        let {props} = this;
        return (
            <div>

            <form
                className="form-horizontal"
                onSubmit={ (e) => e.preventDefault() }>

                <List>
                    {_.map(props.identities, (identity, key) => {
                        return <IdentityComponent key={key} identity={identity}/>
                    })}
                </List>
                <RaisedButton
                          label="Add new identity"
                          containerElement={<Link to="/app/my/profile" />}
                          linkButton={true}
                        />

            </form>
            </div>
        );
    },
    onNewIdentiy() {
        debug('onNewIdentiy');
        this.props.identityNew();
    }
} );
