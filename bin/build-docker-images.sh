#!/bin/bash

set -e
BASE_DIR=`dirname "$0"`

VERSION=${npm_package_version}
NAME=${npm_package_version}

if [ -z "$VERSION" ]; then
  VERSION="0.1.0"
fi

echo Image version: $VERSION

pushd ${BASE_DIR}/.. 2>&1 >/dev/null

docker image build -f Dockerfile.monorepo . \
-t monorepo:$VERSION

docker image build -f Dockerfile.subapp . \
-t apic-management-subapp:$VERSION \
-t apic-management-subapp:latest \
--build-arg "VERSION=$VERSION" \
--build-arg "BASE_IMAGE=node:14-slim"

popd 2>&1 >/dev/null
