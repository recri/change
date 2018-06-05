all: ../src/text/wilhelm.js \
	../src/text/wilhelm-baynes.js \
	../src/text/wilhelm-google.js

../src/text/wilhelm.js: text-wilhelm.xml xml-processor
	./xml-processor text-wilhelm.xml > ../src/text/wilhelm.js
../src/text/wilhelm-baynes.js: text-wilhelm-baynes.xml xml-processor
	./xml-processor text-wilhelm-baynes.xml > ../src/text/wilhelm-baynes.js
../src/text/wilhelm-google.js: text-wilhelm-google.xml xml-processor
	./xml-processor text-wilhelm-google.xml > ../src/text/wilhelm-google.js
text-wilhelm-google.xml: text-wilhelm-google.txt xml-processor
	./xml-processor --from-txt text-wilhelm-google.txt > text-wilhelm-google.xml
