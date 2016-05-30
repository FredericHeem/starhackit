import _ from 'lodash';
import React from 'react';
import tr from 'i18next';
import Spinner from 'components/spinner';
import Debug from 'debug';
let debug = new Debug("components:user");

const Item = ({name, value}) =>(
    <div><div>{name}</div><div>{value}</div></div>
)

Item.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.any.isRequired
};

export default React.createClass({
    propTypes:{
        usersGetOne: React.PropTypes.object.isRequired
    },
    render() {
        debug(`render `, this.props);

        let user = this.props.usersGetOne.data;
        if(_.isEmpty(user)){
            return <Spinner/>
        }

        return (
            <div className='user'>
                <Item name={tr.t('id')} value={user.id}/>
                <Item name={tr.t('username')} value={user.username}/>
                <Item name={tr.t('email')} value={user.email}/>
            </div>
        );
    }
} );
