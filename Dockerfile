FROM library/archlinux 

ARG beaconUser=beacon
ARG beaconRoot=/opt/beacon

RUN pacman --noconfirm -Syu

RUN groupadd -g 1000 ${beaconUser}
RUN useradd  -g 1000 -u 1000 -s /bin/bash -m ${beaconUser}

RUN mkdir ${beaconRoot}

RUN chown ${beaconUser}:${beaconUser} ${beaconRoot}
# RUN chmod 0755 ${beaconRoot}

RUN pacman --noconfirm -S python3
RUN pacman --noconfirm -S python-pip
RUN pacman --noconfirm -S nodejs

USER ${beaconUser}
WORKDIR ${beaconRoot}

COPY --chown=${beaconUser}:${beaconUser} ./schema ${beaconRoot}/schema
COPY --chown=${beaconUser}:${beaconUser} ./srvr   ${beaconRoot}/srvr
COPY --chown=${beaconUser}:${beaconUser} ./uix    ${beaconRoot}/uix

USER root
RUN pacman --noconfirm -S tree


