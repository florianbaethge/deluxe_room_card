.PHONY: version update-version test-version build install test lint

# Get current version
version:
	@cat VERSION

# Update version everywhere (usage: make update-version VERSION=1.0.0)
update-version:
ifdef VERSION
	@node scripts/update-version.mjs $(VERSION)
	@echo "Updated all files to version $(VERSION); bundle rebuilt"
else
	@echo "Usage: make update-version VERSION=1.0.0"
	@exit 1
endif

# Test version consistency (part of the vitest suite)
test-version:
	@npx vitest run tests/version.test.ts

install:
	npm install

build:
	npm run build

test:
	npm test

lint:
	npm run lint && npm run typecheck
