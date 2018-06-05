import { Random } from './random.js';

export class Change extends Random {
    // object that maps stationary lines into indexes for fetching text
    // static getter
    static get lines() {
	return { 
	    "777777":"0","888888":"1","788878":"2","878887":"3","777878":"4","878777":"5","878888":"6","888878":"7",
	    "777877":"8","778777":"9","777888":"10","888777":"11","787777":"12","777787":"13","887888":"14","888788":"15",
	    "788778":"16","877887":"17","778888":"18","888877":"19","788787":"20","787887":"21","888887":"22","788888":"23",
	    "788777":"24","777887":"25","788887":"26","877778":"27","878878":"28","787787":"29","887778":"30","877788":"31",
	    "887777":"32","777788":"33","888787":"34","787888":"35","787877":"36","778787":"37","887878":"38","878788":"39",
	    "778887":"40","788877":"41","777778":"42","877777":"43","888778":"44","877888":"45","878778":"46","877878":"47",
	    "787778":"48","877787":"49","788788":"50","887887":"51","887877":"52","778788":"53","787788":"54","887787":"55",
	    "877877":"56","778778":"57","878877":"58","778878":"59","778877":"60","887788":"61","787878":"62","878787":"63"
	} 
    }
    // object that maps zero based index in King Wen order to stationary lines
    static get numbers() {
	return { 
	    "0":"777777","1":"888888","2":"788878","3":"878887","4":"777878","5":"878777","6":"878888","7":"888878",
	    "8":"777877","9":"778777","10":"777888","11":"888777","12":"787777","13":"777787","14":"887888","15":"888788",
	    "16":"788778","17":"877887","18":"778888","19":"888877","20":"788787","21":"787887","22":"888887","23":"788888",
	    "24":"788777","25":"777887","26":"788887","27":"877778","28":"878878","29":"787787","30":"887778","31":"877788",
	    "32":"887777","33":"777788","34":"888787","35":"787888","36":"787877","37":"778787","38":"887878","39":"878788",
	    "40":"778887","41":"788877","42":"777778","43":"877777","44":"888778","45":"877888","46":"878778","47":"877878",
	    "48":"787778","49":"877787","50":"788788","51":"887887","52":"887877","53":"778788","54":"787788","55":"887787",
	    "56":"877877","57":"778778","58":"878877","59":"778878","60":"778877","61":"887788","62":"787878","63":"878787"
	} 
    }

    constructor(bookObj, commentaryObj) {
	super();
	this.book = {};
	// this.setDist('yarrow');	// yarrow, coins, uniform, custom
	// this.setCustom('3113');	// /[1-9]{4}/
	// this.setFormat('single'); // single, multiple
	if (bookObj) this.setBookObj(bookObj.name, bookObj);
	if (commentaryObj) this.setCommentaryObj(commentaryObj);
    }
    
    _updateHists() {
	this._hist = this.hist_for_dist(this._dist, '6789');
    }

    setCustom(custom) {
	if (/^[1-9]{4}$/.test(custom))
	    this._custom = custom;
	else
	    this._custom = this.choosen("123456789", 4);
	if (this._distName === 'custom') this._updateHists();
	return this._custom;
    }
    getCustom() { return this._custom; }

    setDist(dist) { 
	// console.log(`set change dist to ${dist}`)
	this._distName = dist;
	switch (dist) {
	case 'yarrow': this._dist = this.distYarrow; break;
	case 'coins': this._dist = this.distCoins; break;
	case 'uniform': this._dist = this.distUniform; break;
	case 'custom': this._dist = this._custom; break;
	default: console.log(`change setDist ${dist}??`); 
	}
	this._updateHists()
	return this.distName;
    }
    getDist() { return this.distName; }

    setFormat(format) {
	return this.format = format;
    }
    getFormat() { return this.format; }

    setProtocol(protocol) { return this.protocol = protocol; }
    getProtocol() { return this.protocol; }

    setBook(book) { 
	// console.log(`change.setBook(${book})`);
	if ( ! book) return this.bookName;
	if (this.bookName === book) return book;
	if (this.book[book]) return this.setBookObj(book, this.book[book]);
	return this.bookName
    }
    setBookObj(bookName, bookObj) {
	// console.log(`change.setBookObj(${bookName}, ${bookObj ? 'obj' : '???'})`);
	this.book[bookName] = bookObj;
	this.bookName = bookName;
	return bookName;
    }
    getBook() {
	return this.bookName;
    }

    setCommentaryObj(commentaryObj) { this.commentary = commentaryObj; }
    
    getBookText(book, hex, value) {
	return this.book[book] ?
	    this.book[book].changes[Change.lines[hex]][value] :
	    '';
    }
    
    getBoolean(book, hex, value) {
	if (this.book[book]) {
	    const entry = this.book[book].changes[Change.lines[hex]]
	    return entry.hasOwnProperty(value) && entry[value]
	}
	return false;
    }

    getBookCommentary(book, hex, value) {
	if (this.book[book] && this.commentary[book])
	    return this.commentary[book].changes[Change.lines[hex]][value]
	return '';
    }
    
    getText(hex, value) { return this.getBookText(this.bookName, hex, value); }

    getBoolean(hex, value) { return this.getBookBoolean(this.bookName, hex, value); }

    getCommentary(hex, value) { return getBookCommentary(this.bookName, hex, value); }
    

    // make a line from a distribution
    getLines() { return this.choosen(this._hist, 6); }

    // choose or age a hexagram using the yarrow stalk oracle
    //	* 6 = old yin:    1 in 16 (0.0625)
    //	* 7 = young yang: 5 in 16 (0.3125)
    //	* 8 = young yin:  7 in 16 (0.4375)
    //	* 9 = old yang:   3 in 16 (0.1875)
    // or as a 4 digit dist: 1573
    get distYarrow() { return '1573'; }

    // choose a hexagram using the coin oracle
    //	* 6 = old yin:    1 in 8 (0.125)
    //	* 7 = young yang: 3 in 8 (0.375)
    //	* 8 = young yin:  3 in 8 (0.375)
    //	* 9 = old yang:   1 in 8 (0.125)
    // or as a 4 digit dist: 1331
    get distCoins() { return '1331'; }

    // choose a hexagram uniformly
    //	* 6 = old yin:    1 in 4 (0.25)
    //	* 7 = young yang: 1 in 4 (0.25)
    //	* 8 = young yin:  1 in 4 (0.25)
    //	* 9 = old yang:   1 in 4 (0.25)
    // or as a 4 digit dist: 1111
    get distUniform() { return '1111'; }

    //
    // translate an oracle into all moving lines
    //
    furthur(str) {  return String(str).replace(/8/g, '6').replace(/7/g, '9'); }

    //
    // translate an oracle backward
    // ie, retract the old lines into new lines
    //
    backward(str) { return String(str).replace(/6/g, '8').replace(/9/g, '7'); }

    //
    // translate an oracle forward
    // ie, change the old lines into their
    // young opposites.
    //
    forward(str) { return String(str).replace(/6/g, '7').replace(/9/g, '8'); }
    
    // get the last hexagram from a change for a link
    tail(str) { return str.slice(-6); }

    // get all but the last hexagram from a change
    head(str) { return str.length <= 6 ? '' : str.slice(0,-7); }

    // cast a new change, append onto previous 
    cast(str) { return str.length === 0 ? this.getLines() : str+','+this.getLines(); }

    // undo the last cast or link
    undo(str) { return this.head(str); }

    // clear the change
    clear(str) { return ''; }

    // set the change
    update(str) {
	return (/^([6789]{6})(,[6789]{6})*$/.test(str)) ? str : '';
    }
    
    // make up a change that produces the whole book in King Wen order
    wholeBook() {
	var book = [];
	for (let i = 0; i < 64; i += 1) {
	    const c = Change.numbers[i];
	    const f = this.furthur(c);
	    book.push(c, f);
	}
	return book.join(',');
    }
}
