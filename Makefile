build:
	traceur --dir src lib --modules=commonjs

test: build
	mocha --reporter list

.PHONY: test
