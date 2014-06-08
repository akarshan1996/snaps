build:
	traceur --dir src lib --modules=commonjs

test:
	mocha
