import _ from 'lodash';

export default function roundFormatted( weight, places = 0 ) {
    let rounded;

    if ( weight ) {
        rounded = _.round( weight, places );
        return parseFloat( rounded ).toLocaleString();
    } else {
        return 0;
    }

}