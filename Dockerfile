FROM node:22-alpine3.19 as base

ARG beaconUser=node
ARG beaconRoot=/opt/beacon

RUN mkdir -p ${beaconRoot}
RUN chown ${beaconUser}:${beaconUser} ${beaconRoot}

USER ${beaconUser}
WORKDIR ${beaconRoot}

ENV YARN_VERSION 1.22.22 

RUN yarn policies set-version $YARN_VERSION
RUN rm -f yarn.lock package.json

COPY --chown=${beaconUser}:${beaconUser} ./schema ${beaconRoot}/schema
COPY --chown=${beaconUser}:${beaconUser} ./srvr   ${beaconRoot}/srvr
COPY --chown=${beaconUser}:${beaconUser} ./uix ${beaconRoot}/uix
COPY --chown=${beaconUser}:${beaconUser} ./.env ${beaconRoot}/uix/vue

# Perhaps switch to yarn workspaces?
WORKDIR ${beaconRoot}/schema/mongoose
RUN rm -f yarn.lock
RUN yarn config set enableTelemetry 0
RUN yarn install

WORKDIR ${beaconRoot}/srvr/hapi
RUN rm -f yarn.lock
RUN yarn config set enableTelemetry 0
RUN yarn install

WORKDIR ${beaconRoot}/uix/vue
RUN rm -f yarn.lock
RUN yarn config set enableTelemetry 0
RUN yarn install
RUN yarn build

USER root
RUN apk update
RUN apk add bash less vim strace

USER node

COPY --chown=${beaconUser}:${beaconUser} ./beacon-entrypoint.sh ${beaconRoot}/
COPY --chown=${beaconUser}:${beaconUser} ./.env ${beaconRoot}/

EXPOSE 9001 8080
ENTRYPOINT [ "/opt/beacon/beacon-entrypoint.sh" ]
