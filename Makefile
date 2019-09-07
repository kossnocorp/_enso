.DEFAULT_GOAL := build
.PHONY: build

SHELL := /bin/bash
PATH := $(shell yarn bin):$(PATH)

test:
	jest

test-watch:
	jest --watch

build:
	@rm -rf lib
	@tsc
	@prettier "lib/**/*.[jt]s" --write --loglevel silent
	@cp {package.json,*.md} lib
	@rsync --archive --prune-empty-dirs --exclude '*.ts' --relative src/./ lib

publish: build
	cd lib && npm publish --access public
