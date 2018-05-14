export class Change {
    // get the text object for the specified hexagram
    // need the database
    static getChange(str) {
    }

    //
    // chose one character from a string at random
    //
    static chooseRandomCharacterFromString(str) { return str.charAt(Math.floor(Math.random()*str.length)); }

    //
    // make n choices of characters from a string
    //
    static chooseRandomCharactersFromString(n, str) {
	var result = '';
	for (var i = 0; i < n; i +=1 )
	    result += Change.chooseRandomCharacterFromString(str);
	return result;
    }

    //
    // make a histogram from distribution counts
    //
    static hist_for_dist(dist,bins) {
	if (dist.length != bins.length)
	    throw "hist_for_dist: dist and bins have different lengths";
	dist = String(dist).split('');
	bins = String(bins).split('');
	var hist = '';
	for (var i = 0; i < dist.length; i += 1)
	    for (var j = 0; j < dist[i]; j += 1)
		hist += bins[i];
	return hist;
    }

    // make a line from a distribution
    static getLines(dist) { return Change.chooseRandomCharactersFromString(6, Change.hist_for_dist(dist, '6789')); }

    // age an existing hexagram into a new hexagram
    // using yin and yang transition probabilities
    static nextLines(str, dist) {
	var yin = Change.hist_for_dist(dist, '6789').replace(/[79]/g,'');
	var yang = Change.hist_for_dist(dist, '6789').replace(/[68]/g,'');
	var result = '';
	for (var i = 0; i < str.length; i += 1) {
	    switch (str.charAt(i)) {
	    case '6':   // old yin and
	    case '7':   // young yang are yang
		result += Change.chooseRandomCharacterFromString(yang);
		continue; // become young or old yang
	    case '8':   // young yin and
	    case '9':   // old yang are yin
		result += Change.chooseRandomCharacterFromString(yin);
		continue; // become young or old yin
	    default:
		throw "Change.nextLines: input line is not 6,7,8, or 9: "+str;
	    }
	}
	return result;
    }

    // choose or age a hexagram using the yarrow stalk oracle
    //	* 6 = old yin:    1 in 16 (0.0625)
    //	* 7 = young yang: 5 in 16 (0.3125)
    //	* 8 = young yin:  7 in 16 (0.4375)
    //	* 9 = old yang:   3 in 16 (0.1875)
    // or as a 4 digit dist: 1573
    static distYarrow() { return '1573'; }
    static getYarrow() { return Change.getLines(Change.distYarrow()); }
    static nextYarrow(str) { return Change.nextLines(str, Change.distYarrow()); }

    // choose a hexagram using the coin oracle
    //	* 6 = old yin:    1 in 8 (0.125)
    //	* 7 = young yang: 3 in 8 (0.375)
    //	* 8 = young yin:  3 in 8 (0.375)
    //	* 9 = old yang:   1 in 8 (0.125)
    // or as a 4 digit dist: 1331
    static distCoin() { return '1331'; }
    static getCoin() { return Change.getLines(Change.distCoin()); }
    static nextCoin(str) { return Change.nextLines(str, Change.distCoin()); }

    // choose a hexagram uniformly
    //	* 6 = old yin:    1 in 4 (0.25)
    //	* 7 = young yang: 1 in 4 (0.25)
    //	* 8 = young yin:  1 in 4 (0.25)
    //	* 9 = old yang:   1 in 4 (0.25)
    // or as a 4 digit dist: 1111
    static distUniform() { return '1111'; }
    static getUniform() { return Change.getLines(6,Change.distUniform()); }
    static nextUniform(str) { return Change.nextLines(str, Change.distUniform()); }

    //
    // translate an oracle backward
    // ie, retract the old lines into new lines
    //
    static backward(str) { return String(str).replace(/6/g, '8').replace(/9/g, '7'); }

    //
    // translate an oracle forward
    // ie, change the old lines into their
    // young opposites.
    //
    static forward(str) { return String(str).replace(/6/g, '7').replace(/9/g, '8'); }
    
    // translate a [6789]+ hexagram to an octal string
    static toOctal(str) {
    }

    // translate an octal string to [6789]+ hexagrams
    static fromOctal(str) {
    }
    
    // get the last hexagram from a change for a link
    static tail(str) { return str.slice(-6); }

    // get all but the last hexagram from a change
    static head(str) { return str.length <= 6 ? '' : str.slice(0,-7); }
    // cast a hexagram, link onto previous 
    static cast(str) { return str.length === 0 ? Change.getYarrow() : str+';'+Change.getYarrow(); }

    // link a hexagram onto the existing change
    static link(str) { return str.length === 0 ? Change.getYarrow() : str+','+Change.nextYarrow(Change.tail(str)); }

    // undo the last cast or link
    static undo(str) { return Change.head(str); }

    // clear the change
    static clear(str) { return ''; }
}

// a one or two digit number should fetch the hexagram with that number
// a four or eight digit number should specify a line distribution
//     yarrow = 1573, coin = 1331, uniform = 1111    
// a six digit number chosen from [6789], the lines
/* function Change(str) {} */
//
// append a hexagram to a display div
//

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
