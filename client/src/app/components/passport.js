import React from 'react';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';
import tr from 'i18next';
import Debug from 'debug';
let debug = new Debug("components:passport");
import Parser from 'newtondev-mrz-parser';

export default React.createClass( {
    getDefaultProps(){
        return {
            ocrResult:null,
        }
    },
    getInitialState() {
        return {
            parsingError: null,
            passport: {},
            errors: {},
            parsed: {
                names:{
                    lastName:null,
                    names:[]
                },
                nationality:{
                    full:""
                }
            }
        }
    },
    extractCode(lines){
        if(lines.length < 2){
            this.setState({parsingError: "Missing one line"});
            return;
        }
        for(let i = 0; i < lines.length; i++){
            let line = lines[i].text;
            // 'P' for passport
            if(line[0] === 'P'){
                //Check if index is not out of range
                let fullLine = line + lines[i + 1].text;
                debug('length: ', fullLine.length);
                fullLine = fullLine.replace(/\s/g, "");
                debug('parsing: ', fullLine);
                debug('length: ', fullLine.length);
                return fullLine;
            }
        }
    },
    parse(result){
        if(!result){
            return;
        }
        this.setState({parsingError: null});
        let {lines} = result;
        let code = this.extractCode(lines);
        if(code){
            try {
                let data = Parser.parse(code);
                debug('parsed: ', data);
                this.setState({parsed: data});
            } catch(e){
                this.setState({parsingError: e.message});
            }
        } else {
            this.setState({parsingError: 'no passport found'});
        }

    },
    componentWillReceiveProps(nextProps){
        debug("componentWillReceiveProps", nextProps);
        this.parse(nextProps.ocrResult);
    },
    render() {
        debug('render ', this.prop)
        let {state} = this;
        let {errors, parsed} = state;
        return (
            <div
                className="form-horizontal"
                onSubmit={ (e) => e.preventDefault() }>

                <div>Error: {this.state.parsingError}</div>

                <div className="form-group">
                    <div className="col-sm-9">
                        <TextField
                            id='surname'
                            floatingLabelText={tr.t('surname')}
                            value={parsed.names.lastName}
                            onChange={_.partial(this.onChange, 'surname')}
                            errorText={errors.surname && errors.surname[0]}
                            />
                        <TextField
                            id='firstname'
                            value={parsed.names.names[0]}
                            floatingLabelText={tr.t('firstname')}
                            errorText={errors.firstname && errors.firstname[0]}
                            />
                        <TextField
                            id='dob'
                            value={formarDob(parsed.dob)}
                            floatingLabelText={tr.t('dob')}
                            errorText={errors.dob && errors.dob[0]}
                            />
                    </div>
                </div>
                <br/>
                <div className="form-group">
                    <div className="col-sm-9">
                        <TextField
                            id='nationality'
                            value={state.parsed.nationality.full}
                            floatingLabelText={tr.t('nationality')}
                            errorText={errors.nationality && errors.nationality[0]}
                            />
                            <TextField
                                id='issuer'
                                value={state.parsed.issuer}
                                floatingLabelText={tr.t('issuer')}
                                errorText={errors.issuer && errors.issuer[0]}
                                />
                            <TextField
                                id='documentNumber'
                                value={state.parsed.documentNumber}
                                floatingLabelText={tr.t('documentNumber')}
                                errorText={errors.documentNumber && errors.documentNumber[0]}
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

function formarDob(dob){
    if(dob){
        return `${dob.day}/${dob.month}/${dob.year}`;
    } else {
        return "";
    }
}
