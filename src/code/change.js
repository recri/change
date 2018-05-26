// import { Changes } from '../code/changes.js';
import { html, svg } from 'lit-html/lib/lit-extended.js';

export class Change {

    constructor(random, text) {
	this.random = random;
	this.dist = 'yarrow';
	this.text = text;
	this.commentary = undefined;
    }
    
    setText(text) { this.text = text; }
    setCommentary(commentary) { this.commentary = commentary; }
    
    getText(hex, value) {
	if (this.text)
	    return this.text.changes[this.text.lines[hex]][value]
	// can I await the arrival?
	return '';
    }

    getCommentary(hex, value) {
	if (this.text && this.commentary)
	    return this.commentary.changes[this.text.lines[hex]][value]
	// can I await the arrival? maybe not coming
	return '';
    }
    
    set dist(value) {
	this._distName = value;
	switch (value) {
	case 'yarrow': this._dist = this.distYarrow; break;
	case 'coins': this._dist = this.distCoins; break;
	case 'uniform': this._dist = this.distUniform; break;
	default: 
	    if (/^[0-9][0-9][0-9][0-9]$/.test(value))
		this._dist = value;
	    else
		this._dist = Math.floor(random.random()*1000).toString()
	    break;
	}
	this._hist = this.random.hist_for_dist(this._dist, '6789');
	this._yinHist = this._hist.slice(0).replace(/[79]/g, '')
	this._yangHist = this._hist.slice(0).replace(/[68]/g, '')
    }

    get dist() { return this.distName; }

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
    get distCoin() { return '1331'; }

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
    cast(str) { return str.length === 0 ? this.getLines() : str+';'+this.getLines(); }

    // link a new change onto the existing change
    link(str) { return str.length === 0 ? this.getLines() : str+','+this.nextLines(this.tail(str)); }

    // undo the last cast or link
    undo(str) { return this.head(str); }

    // clear the change
    clear(str) { return ''; }

    // set the change
    update(str) {
	return (/^([6789]{6})(,[6789]{6})*$/.test(str)) ? str : '';
    }
    
    //
    // draw a hexagram with moving line marks
    // set width and height on the svg element to alter display size 
    //
    // suppose we make lines and the gaps between the same width, 
    // and use that width as the margin, too.  Then we want height
    // to be a multiple of 13, and a multiple that is odd so that 
    // the midline of the horizontal strokes is integral, too.
    //
    kua(lines) {
	const width = 390 // 13*2*3*5
	const height = 390
	const margin = width/13
	const x0 = margin+2, x1 = (width-margin-2)
	const xm = x0+(x1-x0)/2
	const sw = margin-4
	const gap = 2*margin
	const r = 9*sw/8
	const yi = (i) => height-(i*2)*margin-margin-margin/2
	const msw = (margin-4)/3
	const draw = (l, y) => { // , x0, x1, sw
	    const line = (cl,x1,y1,x2,y2,sw) =>
		  svg`<line class$="${cl}" x1$="${x1}" y1$="${y1}" x2$="${x2}" y2$="${y2}" stroke-width$="${sw}"></line>`;
	    const circle = (cl,cx,cy,r,sw) =>
		  svg`<circle class$="${cl}" cx$="${cx}" cy$="${cy}" r$="${r}" stroke-width$="${sw}" fill="none"></circle>`;
	    const youngYin = () => 
		  svg`${line("kua-line", x0, y, xm-gap, y, sw)}${line("kua-line", xm+gap, y, x1, y, sw)}`;
	    const youngYang = () =>
		  svg`${line("kua-line", x0, y, x1, y, sw)}`;
	    const markYin = () =>
		  svg`${line("kua-mark", xm-r, y-r, xm+r, y+r, msw)}${line("kua-mark", xm-r, y+r, xm+r, y-r, msw)}`;
	    const markYang = () =>
		  svg`${circle("kua-mark", xm,y,r,msw)}`;
	    const oldYin = () =>
		  svg`${youngYin()}${markYin()}`;
	    const oldYang = () =>
		  svg`${youngYang()}${markYang()}`;
	    switch (l) {
	    case '6': return svg`${oldYin()}`;    // 6 old yin, broken line, x at the midpoint
	    case '7': return svg`${youngYang()}`; // 7 young yang, solid line
	    case '8': return svg`${youngYin()}`;  // 8 young yin, broken line
	    case '9': return svg`${oldYang()}`;	  // 9 old yang, solid line, circle at the midpoint
	    }
	}
	return html`
<svg class="kua" viewBox="0 0 390 390">
  ${lines.split('').map((l,i) => draw(l, yi(i)))}
</svg>`
    }
}
