import React from 'react';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';
import tr from 'i18next';
import Debug from 'debug';
let debug = new Debug("components:passport");

export default React.createClass( {
    getDefaultProps(){
        return {
            passport: {}
        }
    },
    getInitialState() {
        return {
            passport: {},
            errors: {}
        }
    },
    componentWillReceiveProps(nextProps){
        debug("componentWillReceiveProps", nextProps);
        this.setState(nextProps.passport || {});
    },
    render() {
        debug('render ')
        let {state} = this;
        let {errors} = state;
        return (
            <div
                className="form-horizontal"
                onSubmit={ (e) => e.preventDefault() }>
                <div className="form-group">
                    <div className="col-sm-9">
                        <TextField
                            id='surname'
                            floatingLabelText={tr.t('surname')}
                            value={state.surname}
                            onChange={_.partial(this.onChange, 'surname')}
                            errorText={errors.surname && errors.surname[0]}
                            />
                        <TextField
                            id='firstname'
                            value={state.firstname}
                            floatingLabelText={tr.t('firstname')}
                            errorText={errors.firstname && errors.firstname[0]}
                            />
                    </div>
                </div>
                <br/>
                <div className="form-group">
                    <div className="col-sm-9">
                        <TextField
                            id='dob'
                            value={state.firstname}
                            floatingLabelText={tr.t('dob')}
                            errorText={errors.dob && errors.dob[0]}
                            />
                    </div>
                </div>
            </div>
        )
    },
    onChange(id, e) {
        debug(`onChange: ${id}: ${e.target.value}`);
        this.setState({[id]: e.target.value});
    },
} );
