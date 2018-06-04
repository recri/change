#!/usr/bin/tclsh

#
# test propositions for yarrow stalk oracle errors
#
        # if we start with 49 stalks 
	# (or 50 before one is set aside)
	# (or with any number of the form 4n+1) 
	# (or 4n+2 before one is set aside)
	# we get 4's and 5's which count as 3's
	# and 8's and 9's which count as 2's
	# and we sum the result to 6, 7, 8, or 9
	# in proportion 1:5:7:3
	# which count as old yin, young yang, young yin, and old yang.

	# if we start with 48 stalks
	# (or 49 before one is set aside)
	# (or with any number of the form 4n)
	# (or 4n+1 before one is set aside)
	# we get 4's which would still count as 3's
	# and 8's which would still count as 2's
	# and we sum the result to 6, 7, 8, or 9
	# in proportion 1:3:3:1
	# which count as old yin, young yang, young yin, and old yang.

	# if we start with 47 stalks
	# (or 48 before one is set aside)
	# (or with any number of the form 4n+3)
	# (or 4n before one is set aside)
	# we get 3's and 4's which would still count as 3's
	# and 7's and 8's which would still count as 2's
	# and we sum the result to 6, 7, 8, or 9
	# in proportion 3:7:5:1
	# which count as old yin, young yang, young yin, and old yang.
	
	# if we start with 46 stalks
	# (or with 47 before one is set aside)
	# (or with any number of the form 4n+2)
	# (or 4n+3 before one is set aside)
	# we get 4's, 6's and 8's
	# which we count as 3, 2.5, and 2,
	# and we sum the result to 6.5, 7.5, or 8.5
	# which happen in proportion 1:2:1.

	# so if we start with a random number of stalks
	# say somewhere around 50, and perform the oracle
	# we have a 1/4 chance of performing the yarrow
	# stalk oracle according to the accepted procedure,
	# a 1/4 chance of performing the complement of the 
	# yarrow stalk oracle, a 1/4 chance of performing
	# the coin oracle according to accepted procedure,
	# and a 1/4 chance of getting nonsense
#
# divide $stalks into two piles, neither empty
#
proc random-in-range {min max} {
    return [expr {int($min+floor(rand()*($max-$min+1)))}]
}
proc test-random-in-range {} {
    for {set i 0} {$i <= 5} {incr i} {
	set hist($i) 0
    }
    for {set i 0} {$i < 10000} {incr i} {
	incr hist([random-in-range 1 5])
    }
    set errors {}
    foreach i [array names hist] {
	if {$hist($i) != 0 && ($i < 1 || $i > 5) } {
	    lappend errors "{random-in-range 1 5} returned $i"
	}
    }
    foreach i {1 2 3 4 5} {
	if {$hist($i) == 0} {
	    lappend errors "{random-in-range 1 5} never returned $i"
	}
    }
    if {[llength $errors] > 0} {
	error [join $errors \n]
    }
}

proc cast-stalks {stalks} {
    set left [random-in-range 1 [expr {$stalks-1}]]
    set right [expr {$stalks-$left}]
    return [list $left $right]
}
proc test-cast-stalks {} {
    for {set i 0} {$i <= 49} {incr i} {
	set hist($i) 0
    }
    for {set i 0} {$i < 10000} {incr i} {
	foreach {left right} [cast-stalks 49] break
	if {$left+$right != 49} {
	    error "{cast-stalks 49} does not sum to 49"
	}
	incr hist($left)
    }
    set errors {}
    foreach i [array names hist] {
	if {$hist($i) > 0 && ($i < 1 || $i > 48)} {
	    lappend errors "{cast-stalks 49} returned $i"
	}
    }
    for {set i 1} {$i < 49} {incr i} {
	if {$hist($i) == 0} {
	    lappend errors "{cast-stalks 49} never returned $i"
	}
    }
    if {[llength $errors] > 0} {
	error [join $errors \n]
    }
}

proc rem-mod-four {x} { expr {($x%4) ? ($x%4) : 4} }

#
# take $stalks number of stalks
# and simulate the casting of a hexagram line
#
proc cast-line {stalks} {

    set result {}
    for {set i 0} {$i < 3} {incr i} {
	# divide into two piles
	foreach {left right} [cast-stalks $stalks] break;

	# count them down: remove one from the right pile
	set count($i) 1
	incr right -1

	# count them down: find remainder left by 4
	set remleft [rem-mod-four $left]

	# add the remainder to the count
	# and decrement the remaining number of stalks
	incr count($i) $remleft
    
	# count them down: find remainder right by 4
	set remright [rem-mod-four $right]

	# add the remainder to the count
	# and decrement the remaining number of stalks
	incr count($i) $remright

	# add it to the result
	lappend result $count($i)

	# remove the count from the stalks remaining
	incr stalks [expr {-$count($i)}]

    }
    return [join $result { }]
}
proc test-cast-line {stalks} {
    set n 500000
    array set xmap {3 3 4 3 5 3 6 2.5 7 2 8 2 9 2}
    for {set i 0} {$i < $n} {incr i} {
	# make a cast and record its raw counts
	set cast [cast-line $stalks]
	if { ! [info exists hist($cast)] } { set hist($cast) 0 }
	incr hist($cast)

	# sum the counts to get a numeric result
	set t [::tcl::mathop::+ {*}$cast]
	if { ! [info exists thist($t)]} { set thist($t) 0 } 
	incr thist($t)
	
	# translate the cast into 2's and 3's
	set d [lmap x $cast { set xmap($x) }]
	if { ! [info exists dhist($d)] } { set dhist($d) 0 }
	incr dhist($d)

	# sum the 2's and 3's to get the usual line value
	set l [::tcl::mathop::+ {*}$d]
	if { ! [info exists lhist($l)] } { set lhist($l) 0 }
	incr lhist($l)
    }
    foreach x [lsort [array names hist]] {
	# puts [format {%5d %5.3f %s} $hist($x) [expr {$hist($x)/double($n)}] $x]
    }
    foreach t [lsort [array names thist]] {
	# puts [format {%5d %5.3f %s} $thist($t) [expr {$thist($t)/double($n)}] $t]
    }
    foreach d [lsort [array names dhist]] {
	# puts [format {%5d %5.3f %s} $dhist($d) [expr {$dhist($d)/double($n)}] $d]
    }
    foreach l [lsort [array names lhist]] {
	puts [format {%6d %5.1f %s} $lhist($l) [expr {$lhist($l)/double($n)/(1.0/16)}] $l]
    }
}

proc dummy {} {
}    
# test-random-in-range
# test-cast-stalks
for {set i 49} {$i > 45} {incr i -1} {
    puts "test-cast-line $i"
    test-cast-line $i
}

