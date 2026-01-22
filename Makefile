.PHONY: install dev build preview lint format clean tree

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf node_modules dist .vite

tree:
	tree -I "node_modules|.nuxt|.git"

docker-build:
	docker build -t lectura-client .

docker-up:
	docker stop lectura-client-web || true
	docker rm lectura-client-web || true
	docker run -d -p 5173:80 --name lectura-client-web lectura-client

docker-down:
	docker stop lectura-client-web || true
	docker rm lectura-client-web || true

docker-logs:
	docker logs -f lectura-client-web

docker-rebuild: docker-down docker-build docker-up

docker-clean:
	docker stop lectura-client-web || true
	docker rm lectura-client-web || true
	docker rmi lectura-client || true