/* 
sudo apt update 
sudo apt install npm 
npm install request    */

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
    word = word.trim(); //  (' ' + word.trim() + ' ');
    var p = 1, pmin = 1e9, prtmin, pos;
    for ( var i = 0; i + n < word.length; i++ ) {
        var part1 = word.substring( i, i+n );
        var part0 = word.substring( i, i+n-1 );
        var v1 = ( nGram[part1] ? nGram[part1] : 0) / nGram['total'+n];
        var v0 = ( nGram[part0] ? nGram[part0] : 0 )/ nGram['total'+(n-1)];
        // console.log( 'v0:' + v0 + ' v1:' + v1 );
        p *= (v0!=0 ? v1/v0 : 0);
        if ( v1/v0 < pmin ) { 
            pmin = v1/v0;
            prtmin = part1;
            pos = i;
        }
    }
    return { p, pmin, prtmin, word, pos };  /* <== cool syntax */
}
function nGramSuggest( nGram, stat ) {
    var pos = +stat['pos'];
    var pstat = stat['p'];

    var prefix = stat['word'].substring(0,pos);
    var suffix = stat['word'].substring(pos+3);
    console.log( prefix + ':' + suffix );

    var suggs = [];
    for ( var gram in nGram ) {
        if ( gram.length == 1 ) continue;
        var sugg = prefix + gram + suffix;
        statsugg = nGramCheck( nGram, sugg, 3 );
        if ( statsugg['p'] == 0 ) continue;
        suggs.push( sugg );
        console.log( statsugg ); 
    }
    suggs = suggs.sort( (a,b) => +a['p'] - +b['p'] );
    for ( var i in suggs ) {
        console.log( suggs[i] );
    }
    // suggs.splice( 100 );
    // console.log( suggs );
    return suggs; 
}
function nGramAdd( nGram, word, n ) {
    word = word.trim(); // ' ' + word + ' ';
    for ( var i =0; i + n < word.length; i++ ) {
        var prt = word.substring( i, i+n );
        if ( nGram[prt] ) {
            nGram[prt]++
        } else {
            nGram[prt] = 1;
            nGram['total']++;
        } 
        nGram['total'+n]++;
    }
}
function nGramStatistics( txt ) {
    var nGram = {
        'total':0, 'total1':0, 'total2':0, 'total3':0, 'total4':0 
    };
    var words = txt.split( /[ ,.;!?()\[\]_»"'+\n\r-]+/ );
    // filtrera bort siffror, namn
    words = words.filter( word => ( 
        word.length > 1 /* tar bort en bokstav långa ord */    &&
         !word.match(/^[0-9A-ZÅÄÖ]/ ) )  /* tar bort namn o siffror */
    );  
    for ( i in words ) {
        nGramAdd( nGram, words[i], 1 );
        nGramAdd( nGram, words[i], 2 );
        nGramAdd( nGram, words[i], 3 );
        // nGramAdd( nGram, words[i], 4 );
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
function processTest( txt, testLista ) {
    var nGram = nGramStatistics( txt );
    console.log( nGram['total'] );
    console.log( nGram['dox'] );
    
    for ( var i in testLista ) {
        var stat = nGramCheck( nGram, testLista[i], 3 );
        console.log( stat );
        var sugg = nGramSuggest( nGram, stat );
       //  console.log( sugg );
    }
    console.log( ' --- DONE                 --- ');
}

var testLista = [
  /*  'snaka',       'lekker',  
    'krata',       'poke', 
    'junggfru',    'leijon',*/
    'paraddox'
];
if ( true ) {
    /* synchronous part */
    var files = [
        'aftonbladet23mars2022.txt',
        'strindbergRodaRummet.txt'
    ];
    var txt = readFile( files[1] );
    txt = cleanText( txt );
    processTest( txt, testLista );
} else {
    /* asynchronous part */
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
        console.log( 'corpus från:' + urls[1] +"\n" );
        processTest( txt, testLista );
  });
}


