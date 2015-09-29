import React from 'react';

export default React.createClass( {

    getDefaultProps() {
        return {
            maxPage: 0,
            nextText: '',
            previousText: '',
            currentPage: 0
        };
    },

    render() {
        var previous = '';
        var next = '';
        var pages = [];
        var window = 11;

        var startIndex = Math.max( this.props.currentPage - 5, 0 );
        var endIndex = Math.min( startIndex + window, this.props.maxPage );

        if ( this.props.currentPage === 0 ) {
            previous = 'disabled';
        }

        if ( this.props.currentPage === (this.props.maxPage - 1) ) {
            next = 'disabled';
        }

        if ( this.props.maxPage >= window && (endIndex - startIndex) <= 10 ) {
            startIndex = endIndex - window;
        }

        for ( let i = startIndex; i < endIndex; i++ ) {
            let selected = this.props.currentPage === i ? 'active' : '';
            pages.push( <li className={selected} ><a href="#" onClick={this.changeToPage(i)}>{i + 1}</a></li> );
        }

        return (
            <div className="custom-pager">
                { pages.length > 1 &&
                    <div className="col-xs-12 text-center">
                        <ul className="pagination pagination-sm">
                            <li className={previous}><a href="#" onClick={this.previous} aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                            {pages}
                            <li className={next}><a href="#" onClick={this.next} aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
                        </ul>
                    </div>
                }
            </div>
        );
    },

    changeToPage( page ) {
        return (e) => {
            this.props.setPage( page );
            e.preventDefault();
        };
    },

    next(e) {
        this.props.next();
        e.preventDefault();
    },

    previous(e) {
        this.props.previous();
        e.preventDefault();
    }


} );