import { html, svg } from 'lit-html/lib/lit-extended.js';

//
// draw a hexagram with moving line marks
// set width and height on the svg element to alter display size 
//
// suppose we make lines and the gaps between the same width, 
// and use that width as the margin, too.  Then we want height
// to be a multiple of 13, and a multiple that is odd so that 
// the midline of the horizontal strokes is integral, too.
//
// draw partial kua with grey, fuzzy missing lines
//
// also draw a trigram if you're only given three lines
// 
// rename to gua and make it an element
export const kua = (lines) => {
    const width = 390;		 // 13*2*3*5 nominal square
    const height = 390;
    const margin = width/13;	 // 6 lines + 5 gaps + top + bottom
    const gap = 2*margin;	 // gap in yin lines
    const x0 = margin+2;	 // left coordinate of lines
    const x1 = (width-margin-2); // right coordinate of lines
    const xm = x0+(x1-x0)/2;	 // middle coordinate of lines
    const sw = margin-4;	 // stroke width on lines
    const msw = (margin-4)/4;	 // stroke width on markers
    const rc = 7*sw/8;		 // radius of circle on old yang (9*sw/8)
    const rx = 3*sw/4;		 // radius of x on old yin
    const yi = (i) => height-margin-margin/2-(i*2)*margin;
    const draw = (l, y) => {
	const line = (cl,x1,y1,x2,y2,sw) =>
	      svg`<line class$="${cl}" x1$="${x1}" y1$="${y1}" x2$="${x2}" y2$="${y2}" stroke-width$="${sw}"></line>`;
	const circle = (cl,cx,cy,r,sw) =>
	      svg`<circle class$="${cl}" cx$="${cx}" cy$="${cy}" r$="${r}" stroke-width$="${sw}" fill="none"></circle>`;
	const markYin = () =>
	      svg`${line("kua-mark", xm-rx, y-rx, xm+rx, y+rx, msw)}${line("kua-mark", xm-rx, y+rx, xm+rx, y-rx, msw)}`;
	const markYang = () =>
	      svg`${circle("kua-mark", xm,y,rc,msw)}`;
	switch (l) {
	case '6': // old yin, broken line, x at the midpoint
	    return svg`${draw('8', y)}${markYin()}`;
	case '7': // young yang, solid line
	    return svg`${line("kua-line", x0, y, x1, y, sw)}`;
	case '8': // young yin, broken line
	    return svg`${line("kua-line", x0, y, xm-gap, y, sw)}${line("kua-line", xm+gap, y, x1, y, sw)}`;
	case '9': // old yang, solid line, circle at the midpoint
	    return svg`${draw('7',y)}${markYang()}`;
	case '?': // a superposition of possibilities, possibly animated
	    return svg``; 
	}
    }
    return html`<svg class="kua" viewBox="0 0 390 390">${lines.split('').map((l,i) => draw(l, yi(i)))}</svg>`
}
