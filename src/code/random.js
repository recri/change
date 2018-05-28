import { MersenneTwister } from './mersenne-twister.js';

export class Random {

    constructor(seed) {
	this.seed = seed || Date.now()
	this.r = new MersenneTwister(this.seed)
    }

    srandom(seed) {
	this.seed = seed || Date.now()
	this.r.reseed(this.seed)
    }

    random() { return this.r.random(); }
	
    shuffle(array) {
	array = array.slice(0)	// copy array
	const n = array.length
	for (let i = 0; i < n; i += 1) {
	    let j = i + Math.floor(this.random()*(n-i))
	    if (i != j) {
		let ai = array[i]
		let aj = array[j]
		array[i] = aj
		array[j] = ai
	    }
	}
	return array
    }
    //
    // make these two generic over strings and arrays
    // chose one character from a string at random
    //
    choose(str) { return str.charAt(Math.floor(this.random()*str.length)); }

    //
    // make n choices of characters from a string
    //
    choosen(str, n) {
	n = Math.max(n,0);
	let res = '';
	for (let i = 0; i < n; i += 1) res = `${res}${this.choose(str)}`;
	return res;
    }

    //
    // make a histogram from distribution counts
    //
    hist_for_dist(dist,bins) {
	return String(dist).split('').map((n, index) => bins.charAt(index).repeat(n)).join('')
    }

}
