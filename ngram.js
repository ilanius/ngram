
// https://nodejs.dev/learn/reading-files-with-nodejs
function readFile( fName ) {
    const fs = require('fs')
    try {
        const data = fs.readFileSync( fName, 'utf8')
        return data;
    } catch (err) {
        console.error(err)
    }

} 

var nGram = {};

function nGramAdd( word, n ) {
    word = ' ' + word + ' ';
    for ( var i =0; i + n < word.length; i++ ) {
        var prt = word.substring( i, i+n );
        nGram[prt] ? nGram[prt]++ : nGram[prt] = 1;
    }
}

function nGramOut() {
    for ( var gr  in nGram ) {
        console.log( gr + ' ' + nGram[gr] );
    }
}

function gramTest( word, n ) {
    word = (' ' + word.trim() + ' ');
    for ( var i = 0; i + n < word.length; i++ ) {
        var prt = word.substring( i, i+n );
        var v = nGram[prt] ? nGram[prt] : 0;
        if ( v == 0 ) {
            console.log( word + ': ' + prt );
        }
    }
}

var txt = readFile( 'aftonbladet23mars2022.txt' ) + ' ';
// console.log( txt );

var words = txt.split( /[ ,.;!?"'+\n\r-]+/ );
words = words.filter( word => ( word.length > 0 && !word.match(/^[0-9A-ZÅÄÖ]/ ) ) );  // filtrera bort siffror, namn
for ( i in words ) {
    nGramAdd( words[i], 2 );
    // nGramAdd( words[i], 3 );
    console.log( i + ' ' + words[i] );
}

nGramOut();

console.log( '---------------------------------------');
gramTest( 'lika barn leka bäst häst ', 2 );
gramTest( 'lika barn leka bäst häst ', 3 );


