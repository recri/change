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
	    const unknown = () =>
		  svg``;
	    switch (l) {
	    case '6': return svg`${oldYin()}`;    // 6 old yin, broken line, x at the midpoint
	    case '7': return svg`${youngYang()}`; // 7 young yang, solid line
	    case '8': return svg`${youngYin()}`;  // 8 young yin, broken line
	    case '9': return svg`${oldYang()}`;	  // 9 old yang, solid line, circle at the midpoint
	    case '?': return svg`${unknown()}`;	  // a fuzzy bar, as yet to be determined
	    }
	}
	return html`
<svg class="kua" viewBox="0 0 390 390">
  ${lines.split('').map((l,i) => draw(l, yi(i)))}
</svg>`
    }
