export class Change {

    constructor(random, text) {
	this.random = random;
	this.setDist('yarrow');	// yarrow, coins, uniform, custom
	this.setCustom('3113');	// /[1-9]{4}/
	this.setFormat('single'); // single, multiple
	this.setText(text);
	this.setCommentary(null);
    }
    
    setCustom(custom) {
	if (/^[1-9]{4}$/.test(custom))
	    this._custom = custom;
	else
	    this._custom = random.choosen("123456789", 4);
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
	default: error(`change setDist ${dist}??`); 
	}
	this._hist = this.random.hist_for_dist(this._dist, '6789');
	this._yinHist = this._hist.slice(0).replace(/[79]/g, '')
	this._yangHist = this._hist.slice(0).replace(/[68]/g, '')
	// console.log(`dist ${dist} ${this._dist} hist ${this._hist} yin ${this._yinHist} yang ${this._yangHist}`)
	return this.distName;
    }
    getDist() { return this.distName; }

    setFormat(format) {
	this.format = format;
	return format;
    }
    getFormat() { return this.format; }

    setText(text) { this.text = text; }
    setCommentary(commentary) { this.commentary = commentary; }
    
    getText(hex, value) {
	return this.text ?
	    this.text.changes[this.text.lines[hex]][value] :
	    '';
    }

    getBoolean(hex, value) {
	if (this.text) {
	    const entry = this.text.changes[this.text.lines[hex]]
	    return entry.hasOwnProperty(value) && entry[value]
	}
	return false;
    }

    getCommentary(hex, value) {
	if (this.text && this.commentary)
	    return this.commentary.changes[this.text.lines[hex]][value]
	// can I await the arrival? maybe not coming
	return '';
    }
    

    // make a line from a distribution
    getLines() { return this.random.choosen(this._hist, 6); }

    // age an existing hexagram into a new hexagram
    // using yin and yang transition probabilities
    nextLines(str) {
	return str.split('').map((c) => this.random.choose(c === '6' || c === '7' ? this._yangHist : this._yinHist)).join('')
    }

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
    
}
