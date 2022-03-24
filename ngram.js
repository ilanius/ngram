
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

var nGram = {
    'total1':0, 'total2':0, 'total3':0, 'total4':0 
};

function nGramAdd( word, n ) {
    word = ' ' + word + ' ';
    for ( var i =0; i + n < word.length; i++ ) {
        var prt = word.substring( i, i+n );
        nGram[prt] ? nGram[prt]++ : nGram[prt] = 1;
    }
    nGram['total'+n]++;
}

function nGramOut() {
    for ( var gr  in nGram ) {
        console.log( gr + ' ' + nGram[gr] );
    }
}

function gramTest( word, n ) {
    word = (' ' + word.trim() + ' ');
    var p = 1;
    for ( var i = 0; i + n < word.length; i++ ) {
        var prt = word.substring( i, i+n );
        var prt0 = word.substring( i, i+n-1 );
        var v = (nGram[prt] ? nGram[prt] : 0) / nGram['total'+n];
        var v0 = ( nGram[prt0] ? nGram[prt0] : 0 )/ nGram['total'+(n-1)];
        console.log( v + ' ' + v0 + ' ' + v/v0 );
        if ( v == 0 ) {
            console.log( word + ': ' + prt );
        }
        p *= v/v0;
    }
    console.log( 'p:' + p );
    return p;
}

var txt = readFile( 'aftonbladet23mars2022.txt' ) + ' ';
// console.log( txt );

var words = txt.split( /[ ,.;!?"'+\n\r-]+/ );
words = words.filter( word => ( word.length > 0 && !word.match(/^[0-9A-ZÅÄÖ]/ ) ) );  // filtrera bort siffror, namn
for ( i in words ) {
    nGramAdd( words[i], 1 );
    nGramAdd( words[i], 2 );
    // nGramAdd( words[i], 3 );
    console.log( i + ' ' + words[i] );
}

nGramOut();

console.log( '---------------------------------------');
gramTest( 'leker', 2 );
gramTest( 'lekker', 2 );


