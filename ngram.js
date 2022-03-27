/* apt update */
/* apt install npm */

/* ********************************************* */
// https://nodejs.dev/learn/reading-files-with-nodejs
/* For use with nodejs  ************************ */
/* ********************************************* */
function readFile( fName ) {
    const fs = require('fs')
    try {
        const data = fs.readFileSync( fName, 'utf8')
        return data;
    } catch (err) {
        console.error(err)
    }
} 

function nGramCheck( nGram, word, n ) {
    word = (' ' + word.trim() + ' ');
    var p = 1, pmin = 1e9, prtmin;
    for ( var i = 0; i + n < word.length; i++ ) {
        var prt = word.substring( i, i+n );
        var prt0 = word.substring( i, i+n-1 );
        var v = (nGram[prt] ? nGram[prt] : 0) / nGram['total'+n];
        var v0 = ( nGram[prt0] ? nGram[prt0] : 0 )/ nGram['total'+(n-1)];
        p = v0 != 0 ? v/v0 : 1e9;
        if ( p < pmin ) { 
            pmin = p;
            prtmin = prt;
        }
    }
    return { pmin, prtmin, word };
}

function nGramAdd( nGram, word, n ) {
    word = ' ' + word + ' ';
    for ( var i =0; i + n < word.length; i++ ) {
        var prt = word.substring( i, i+n );
        nGram[prt] ? nGram[prt]++ : nGram[prt] = 1;
    }
    nGram['total'+n]++;
}
function nGramStatistics( txt ) {
    var nGram = {
        'total1':0, 'total2':0, 'total3':0, 'total4':0 
    };
    var words = txt.split( /[ ,.;!?"'+\n\r-]+/ );

    // filtrera bort siffror, namn
    words = words.filter( word => ( word.length > 0 && !word.match(/^[0-9A-ZÅÄÖ]/ ) ) );  
    for ( i in words ) {
        nGramAdd( nGram, words[i], 1 );
        nGramAdd( nGram, words[i], 2 );
        nGramAdd( nGram, words[i], 3 );
        // console.log( i + ' ' + words[i] );
    }
    return nGram;
}

function cleanText( txt ) {
    console.log('Removing non text');
    txt = txt.replace( /[\r\n]+/igm, ' ');
    txt = txt.replace( /<script[\s\S]*?<\/script>/ig, ' ');
    txt = txt.replace( /<style[\s\S]*?<\/style>/ig, ' ');
    txt = txt.replace( /(<([^>]+)>)/ig, ' ');
    txt = txt.replace( /[\d()/…”,.;:*'"+-]+/ig, ' ');
    txt = txt.replace( / [\w!_–] /ig, ' ');  // different - than above ?!
    txt = txt.replace( / +/ig, ' ');
    return txt;
}

function processText( txt ) {
    var nGram = nGramStatistics( txt );

    var testTxt = 'snacka snaka lekker leker krata kratta kaskad kasskad karrlskrona poke projektill';
    var testLista = testTxt.split( / / );
    for ( var i in testLista ) {
        var stat = nGramCheck( nGram, testLista[i], 3 );
        console.log( stat );
    }
}

// var txt = readFile( 'aftonbladet23mars2022.txt' ) + ' ';

const request = require('request');

var urls = [ 
    'https://sprakbanken.se/aktuellt/nyheter/snartpremiarfornysvenskkorpus.5.b86c4c173e68e512a3863.html', 
    'https://www.aftonbladet.se/nyheter/kolumnister/a/jaA1eo/gar-sverige-med-i-nato-nu-ar-vi-inte-riktigt-kloka',
    'https://www.gutenberg.org/cache/epub/57052/pg57052.txt', // Strindberg Röda Rummet
];

request( urls[2], (error, response, txt) => {
    if (error) {
        console.error(`Could not send request to API: ${error.message}`);
        return;
    }

    if (response.statusCode != 200) {
        console.error(`Expected status code 200 but received ${response.statusCode}.`);
        return;
    }
    txt = cleanText( txt );
    console.log( ' --- START TEXT FROM HTML --- ');
    console.log( txt );
    console.log( ' --- END TEXT FROM HTML   --- ');
    console.log( ' --- START processText    --- ');
    processText( txt );
    console.log( ' --- DONE                 --- ');
});


