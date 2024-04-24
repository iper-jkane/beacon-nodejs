FROM archlinux:base-devel-20240101.0.204074 as base

ARG beaconUser=beacon
ARG beaconRoot=/opt/beacon

RUN pacman --noconfirm -Sy

RUN groupadd -g 1000 ${beaconUser}
RUN useradd  -g 1000 -u 1000 -s /bin/bash -m ${beaconUser}

RUN mkdir ${beaconRoot}

RUN chown ${beaconUser}:${beaconUser} ${beaconRoot}
# RUN chmod 0755 ${beaconRoot}

RUN pacman --noconfirm -Sy python3 python-pip nodejs httpie tree vim
RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn config set --home enableTelemetry 0

#-
FROM base as build

ARG BNJS_UIX_URL
ARG BNJS_API_URL
ARG BNJS_API_CORS_ORIGINS

ENV BNJS_UIX_URL ${BNJS_UIX_URL}
ENV BNJS_API_URL ${BNJS_API_URL}
ENV BNJS_API_CORS_ORIGINS ${BNJS_API_CORS_ORIGINS}

RUN pacman --noconfirm -Sy base-devel

USER ${beaconUser}
WORKDIR ${beaconRoot}

COPY --chown=${beaconUser}:${beaconUser} ./schema ${beaconRoot}/schema
COPY --chown=${beaconUser}:${beaconUser} ./srvr   ${beaconRoot}/srvr
COPY --chown=${beaconUser}:${beaconUser} ./uix    ${beaconRoot}/uix
# COPY --chown=${beaconUser}:${beaconUser} ./beacon-entrypoint.sh ${beaconRoot}/

WORKDIR ${beaconRoot}/schema/mongoose
RUN yarn config set enableTelemetry 0
RUN yarn install

WORKDIR ${beaconRoot}/srvr/hapi
RUN yarn config set enableTelemetry 0
RUN yarn install

WORKDIR ${beaconRoot}/uix/vue
RUN yarn config set pnpEnableEsmLoader false
RUN yarn config set enableTelemetry 0
RUN yarn install
RUN yarn build

#---
FROM base as final

USER ${beaconUser}
WORKDIR ${beaconRoot}

COPY --from=build --chown=${beaconUser}:${beaconUser} ${beaconRoot}/schema ${beaconRoot}/schema
COPY --from=build --chown=${beaconUser}:${beaconUser} ${beaconRoot}/srvr   ${beaconRoot}/srvr
COPY --from=build --chown=${beaconUser}:${beaconUser} ${beaconRoot}/uix    ${beaconRoot}/uix
COPY --chown=${beaconUser}:${beaconUser} ./beacon-entrypoint.sh ${beaconRoot}/

EXPOSE 9001 8080
ENTRYPOINT [ "/opt/beacon/beacon-entrypoint.sh" ]
