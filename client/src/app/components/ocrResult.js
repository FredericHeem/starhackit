import React from 'react';
import _ from 'lodash';
import Debug from 'debug';

import LinearProgress from 'material-ui/lib/linear-progress';
let debug = new Debug("components:ocr");

export default React.createClass( {

    render() {
        let {ocr, completed, loading, progress} = this.props;

        if(completed){
            return (
                <div>
                    <LinearProgress mode="determinate" value={completed * 100} />
                </div>
            );
        } else if(loading || progress){
            return (
                <div>
                    <LinearProgress mode="indeterminate"/>
                </div>
            );
        }

        if(!ocr) {
            return (
                <div></div>
            );
        }
        let {lines} = ocr;
        debug('render ', lines);
        return (
            <div className="">
                <div>Confidence: {ocr.confidence}</div>
                <div>{lines.length} lines:</div>
                {_.map(lines, (line, i) => {
                    return <div key={i}>{line.text}</div>
                })}

            </div>
        );
    }

} );
