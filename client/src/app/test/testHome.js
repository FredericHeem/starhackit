import React from 'react';
import _ from 'lodash';
import tr from 'i18next';

import CommonDeck from 'components/test/commonDeck'

function createComponents(deck){
    let Component = deck.component;
    //console.log('createComponents AAAAAAAAAAAAAAAA')
    //console.log('createComponents ', deck.name)
    //console.log('createComponents ', deck.fixtures)
    return _.map(deck.fixtures, (fixture, key) => (
        <div>
            <div>{tr.t('Fixture')} {fixture.name}</div>
            <Component key={key} {...fixture.props}/>
        </div>
    ))
}

function createDeck(deck, key){

    return (
        <div key={key}>
            <div>{tr.t('Deck Name')} {deck.name}</div>
            {createComponents(deck)}
        </div>
    )
}

export default function TestHome(){
    return (
        <div>
            {_.map(CommonDeck(), (deck, key) => createDeck(deck, key))}
        </div>
    )
}
