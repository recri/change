all: ../src/text/wilhelm.js \
	../src/text/wilhelm-baynes.js \
	../src/text/wilhelm-google.js \
	../src/text/yizhou.js \
	../src/text/legge.js

 ../src/text:
	mkdir -p ../src/text
../src/text/wilhelm.js: text-wilhelm.xml xml-processor ../src/text
	./xml-processor text-wilhelm.xml > ../src/text/wilhelm.js
../src/text/wilhelm-baynes.js: text-wilhelm-baynes.xml xml-processor ../src/text
	./xml-processor text-wilhelm-baynes.xml > ../src/text/wilhelm-baynes.js
../src/text/wilhelm-google.js: text-wilhelm-google.xml xml-processor ../src/text
	./xml-processor text-wilhelm-google.xml > ../src/text/wilhelm-google.js
../src/text/yizhou.js: text-yizhou-legge.xml xml-processor ../src/text
	./xml-processor --to-yizhou text-yizhou-legge.xml > ../src/text/yizhou.js
../src/text/legge.js: text-yizhou-legge.xml xml-processor ../src/text
	./xml-processor --to-legge text-yizhou-legge.xml > ../src/text/legge.js
text-wilhelm-google.xml: text-wilhelm-google.txt xml-processor ../src/text
	./xml-processor --from-txt text-wilhelm-google.txt > text-wilhelm-google.xml
