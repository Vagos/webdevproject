BIN = "node_modules/.bin"

all:
	npm install

run:
	find . -not \( -path "./db/*" -prune \) -name '*.js' | entr -r node index.js

test:
	./$(BIN)/jshint ./ --exclude node_modules,db
	./$(BIN)/jest --forceExit

docker:
	docker-compose start
