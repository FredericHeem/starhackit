import React from 'react';

export default React.createClass({
    getDefaultProps() {
        return {
            version: ""
        };
    },
    shouldComponentUpdate() {
        return false;
    },

    render() {
        return (
            <footer className="footer hidden-print">
                <div className="container">
                    <div className="row">

                        <div className="content col-md-12 col-sm-12 text-center">
                            <div>StarHackIt is the starting point to build a full stack web application.</div>
                            <div>
                                Get the source code at <a href="https://github.com/FredericHeem/starhackit" target="_blank">GitHub</a>
                            </div>
                            <div>
                                {this.props.version}
                            </div>
                        </div>


                    </div>
                </div>
            </footer>
        );
    }

} );
