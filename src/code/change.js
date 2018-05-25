// import { Changes } from '../code/changes.js';
import { html, svg } from 'lit-html/lib/lit-extended.js';

export class Change {

    constructor(random) {
	this.random = random;
	this.dist = 'yarrow';
	this.text = undefined;
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
	const width = 128
	const height = 128
	const margin = 10
	const x0 = margin, x1 = (width-margin)
	const gap = (x1-x0)/10
	const r = gap*7/10
	const mid = x0+(x1-x0)/2
	const yi = (i) => height-(i*2)*margin-margin-margin/2
	const sw = 3
	const draw = (l, y) => { // , x0, x1, sw
	    // const gap = (x1-x0)/10;
	    // const r = gap*7/10;
	    // const mid = x0+(x1-x0)/2;
	    const line = (cl,x1,y1,x2,y2,sw) =>
		  svg`<line class$="${cl}" x1$="${x1}" y1$="${y1}" x2$="${x2}" y2$="${y2}"></line>`;
	    const circle = (cl,cx,cy,r,sw) =>
		  svg`<circle class$="${cl}" cx$="${cx}" cy$="${cy}" r$="${r}" fill="none"></circle>`;
	    
	    // 6 old yin, broken line, x at the midpoint
	    // 7 young yang, solid line
	    // 8 young yin, broken line
	    // 9 old yang, solid line, circle at the midpoint
	    let ret = ''
	    switch (l) {
	    case '6': 
		return svg`${line("kua-line", x0, y, mid-gap, y)}${line("kua-line", mid+gap, y, x1, y)}
			${line("kua-mark", mid-r, y-r, mid+r, y+r)}${line("kua-mark", mid-r, y+r, mid+r, y-r)}`;
	    case '8':
		return svg`${line("kua-line", x0, y, mid-gap, y)}${line("kua-line", mid+gap, y, x1, y)}`;
	    case '9': 
		return svg`${line("kua-line", x0, y, x1, y)}
			${circle("kua-mark", mid,y,r)}`;
	    case '7':
		return svg`${line("kua-line", x0, y, x1, y)}`;
	    }
	}
	return html`
<svg class="kua" viewBox="0 0 128 128">
  ${lines.split('').map((l,i) => draw(l, yi(i)))}
</svg>`
    }
}
/*
function displayChanges(id, str) {
  alert("display changes id='"+id+"' and str='"+str+"'");
  if (str == null || str == '')
    str = consultYarrowStalkOracle();
  else if (str.match(/^[6-9][6-9][6-9][6-9][6-9][6-9](,[6-9][6-9][6-9][6-9][6-9][6-9])*$/))
    str = str;
  else if (str.match(/^(yarrow|coin|uniform|\d\d\d\d)(,[0-9]+)?$/)) {
    // alert("matched regexp in displayChanges()");
    var strs = str.split(',');
    var random = strs[0];
    var repeat = strs[1];
    switch (random) {
    case 'yarrow': random = Change.distYarrow; break;
    case 'coin': random = Change.distCoin; break;
    case 'uniform': random = Change.distUniform; break;
    default: random = random; break;
    }
    var last = str = Change.getLines(random);
    while (--repeat > 0) {
      last = Change.nextLines(last, random);
      str += ","+last;
    }
    str += ","+Change.forward(last);
  }
  alert("requesting changes for "+str+" from server");
  Change.getChange(str, function (xml) {
      var params = xmlrpc2js(xml);
      drawChanges(id, params[0], str);
  });
}
*/
//
//
//
/*
function getShowHideElement(event) {
  var id;
  if (event && event.target && event.target.getAttribute("id")) {
    id = 'chid'+(1+Number(event.target.getAttribute("id").substr(4)));
  } else if (event && event.currentTarget && event.currentTarget.getAttribute("id")) {
    id = 'chid'+(1+Number(event.currentTarget.getAttribute("id").substr(4)));
  } else {
    return null;
  }
  var elt = document.getElementById(id);
  if (elt == null) return null;
  if (elt.className != 'comment') return null;
  return elt;
}
function show(event) {
  var elt = getShowHideElement(event);
  if (elt != null) 
    elt.setAttribute("style", "display:block;position:fixed;top:"+event.clientY+"px;left:20%");
}
function hide(event) {
  var elt = getShowHideElement(event);
  if (elt != null) 
    elt.setAttribute("style", "display:none");
}
//
// draw a hexagram with moving line marks
//
function drawKua(id, lines) {
  function svgLine(x1,y1,x2,y2,sw) {
    var line = document.createElementNS(SVG, 'line');
    line.setAttribute('x1', ''+x1);
    line.setAttribute('y1', ''+y1);
    line.setAttribute('x2', ''+x2);
    line.setAttribute('y2', ''+y2);
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', sw);
    return line;
  }
  function svgCircle(cx,cy,r,sw) {
    var circle = document.createElementNS(SVG, 'circle');
    circle.setAttribute('cx', ''+cx);
    circle.setAttribute('cy', ''+cy);
    circle.setAttribute('r', ''+r);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke-width', sw);
    return circle;
  }
  function drawLine(line, x0, x1, y, sw) {
    var g = document.createElementNS(SVG, "g");
    var gap = (x1-x0)/10;
    var r = gap*7/10;
    var mid = x0+(x1-x0)/2;
    switch (line) {
    case '6':   // old yin, x at the midpoint
      g.appendChild(svgLine(mid-r, y-r, mid+r, y+r, sw-1));
      g.appendChild(svgLine(mid-r, y+r, mid+r, y-r, sw-1));
    case '8':   // young yin
      g.appendChild(svgLine(x0, y, mid-gap, y, sw));
      g.appendChild(svgLine(mid+gap, y, x1, y, sw));
      break;
    case '9':   // old yang, circle the midpoint
      g.appendChild(svgCircle(mid,y,r,sw-1));
    case '7':   // young yang
      g.appendChild(svgLine(x0, y, x1, y, sw));
      break;
    }
    return g;
  }
  var svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('width', '128');
  svg.setAttribute('height', '128');
  for (var i = 0; i < 6; i += 1) {
    svg.appendChild(drawLine(lines.charAt(i), 10, 118, 128-(i*2)*10-14, 3));
  }
  document.getElementById(id).appendChild(svg);
}
//
//
//
function drawChanges(id, changes, str) {
  alert("drawChanges("+id+",...)");
  var doc = document.getElementById(id);
  var html = "";
  var id_counter = 1;
  function new_id() { return 'chid'+id_counter++; }
  var strs = str.split(',');
  // body
  html += "<div class=\"bodyBox\">\n";
  // text
  html += "<div class=\"textBox\">\n";
  for (var i = 0; i < changes.length; i += 1) {
    var change = changes[i];
    change.str = strs[i];
    change.idc = new_id();              // character div id
    change.idk = new_id();              // kua div id
    change.idt = new_id();              // text div id
    change.idtc = new_id();             // text comment div id
    change.idj = new_id();              // judgment div id
    change.idjc = new_id();             // judgment comment div id
    change.idi = new_id();              // image div id
    change.idic = new_id();             // image comment div id
    // text
    html += "<div class=\"text\" id=\""+change.idt+"\">\n";
    html += "<div id=\""+change.idc+"\"></div><br/>\n";
    html += "<b>"+change.num+". </b><b><i>"+change.name+" / "+change.name_interp+"</i></b>\n";
    html += "<table>\n";
    html += "<tr><td rowspan='2'><div id='"+change.idk+"'></div></td>\n";
    html += "<td valign=\"middle\">above "+change.above+" / "+change.above_interp+"</td></tr>\n";
    html += "<tr><td valign=\"middle\">below "+change.below+" / "+change.below_interp+"</td></tr>\n";
    html += "</table>\n";
    html += "</div><br/>\n";
    html += "THE JUDGMENT<br/>\n"
    html += "<div class=\"text\" id=\""+change.idj+"\">"+change.judgment+"</div><br/>\n";
    html += "THE IMAGE<br/>\n"
    html += "<div class=\"text\" id=\""+change.idi+"\">"+change.image+"</div><br/>\n";
    // line text
    for (var j = 0; j < change.lines.length; j += 1) {
      if (j == 0) {
        html += "THE LINES<br/>\n";
      }
      var line = change.lines[j];
      line.idl = new_id();
      line.idlc = new_id();
      html += "<div class=\"text\" id=\""+line.idl+"\">"+line.text+"</div><br/>\n";
    }
  }
  html += "</div>\n";   // end textBox
  // comments
  html += "<div class=\"commentBox\">\n";
  for (var i = 0; i < changes.length; i += 1) {
    var change = changes[i];
    // comments
    html += "<div class=\"comment\" id=\""+change.idtc+"\" style=\"display:none\">"+change.comment+"</div>\n";
    html += "<div class=\"comment\" id=\""+change.idjc+"\" style=\"display:none\">"+change.judgment_comment+"</div>";
    html += "<div class=\"comment\" id=\""+change.idic+"\" style=\"display:none\">"+change.image_comment+"</div>\n";
    // line comments
    for (var j = 0; j < change.lines.length; j += 1) {
      var line = change.lines[j];
      html += "<div class=\"comment\" id=\""+line.idlc+"\" style=\"display:none\">"+line.comment+"</div>\n";
    }
  }
  html += "</div>\n";   // end commentBox
  html += "</div>\n";   // end bodyBox
  doc.innerHTML = html;
  // do some DOM modifications
  for (var i = 0; i < changes.length; i += 1) {
    var change = changes[i];
    // draw the hexagram
    drawKua(change.idk, change.str);
    // set event handlers to show/hide the commentary
    document.getElementById(change.idt).addEventListener('mouseover', show, false);
    document.getElementById(change.idt).addEventListener('mouseout', hide, false);
    document.getElementById(change.idj).addEventListener('mouseover', show, false);
    document.getElementById(change.idj).addEventListener('mouseout', hide, false);
    document.getElementById(change.idi).addEventListener('mouseover', show, false);
    document.getElementById(change.idi).addEventListener('mouseout', hide, false);
    for (var j = 0; j < change.lines.length; j += 1) {
      var line = change.lines[j];
      document.getElementById(line.idl).addEventListener('mouseover', show, false);
      document.getElementById(line.idl).addEventListener('mouseout', hide, false);
    }
  }
}
*/
