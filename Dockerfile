FROM library/archlinux 

ARG beaconUser=beacon
ARG beaconRoot=/opt/beacon

RUN pacman --noconfirm -Syu

RUN groupadd -g 1000 ${beaconUser}
RUN useradd  -g 1000 -u 1000 -s /bin/bash -m ${beaconUser}

RUN mkdir ${beaconRoot}

RUN chown ${beaconUser}:${beaconUser} ${beaconRoot}
# RUN chmod 0755 ${beaconRoot}

RUN pacman --noconfirm -Sy python3 python-pip nodejs httpie tree vim base-devel
RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn config set --home enableTelemetry 0

USER ${beaconUser}
WORKDIR ${beaconRoot}

COPY --chown=${beaconUser}:${beaconUser} ./schema ${beaconRoot}/schema 
COPY --chown=${beaconUser}:${beaconUser} ./srvr   ${beaconRoot}/srvr
COPY --chown=${beaconUser}:${beaconUser} ./uix    ${beaconRoot}/uix
COPY --chown=${beaconUser}:${beaconUser} ./beacon-entrypoint.sh ${beaconRoot}/

WORKDIR ${beaconRoot}/schema/mongoose
RUN yarn install

WORKDIR ${beaconRoot}/srvr/hapi
RUN yarn install

WORKDIR ${beaconRoot}/uix/vue
RUN yarn config set pnpEnableEsmLoader false
RUN yarn plugin import plugin-interactive-tools
RUN yarn install

EXPOSE 9001 8080

USER ${beaconUser}
ENTRYPOINT [ "/opt/beacon/beacon-entrypoint.sh" ]
