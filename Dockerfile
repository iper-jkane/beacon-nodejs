FROM library/archlinux 

ARG beaconUser=beacon
ARG beaconRoot=/opt/beacon

RUN pacman --noconfirm -Syu

RUN groupadd -g 1000 ${beaconUser}
RUN useradd  -g 1000 -u 1000 -s /bin/bash -m ${beaconUser}

RUN mkdir ${beaconRoot}

RUN chown ${beaconUser}:${beaconUser} ${beaconRoot}
# RUN chmod 0755 ${beaconRoot}

RUN pacman --noconfirm -S python3 python-pip nodejs yarn httpie tree vim

USER ${beaconUser}
WORKDIR ${beaconRoot}

COPY --chown=${beaconUser}:${beaconUser} ./schema ${beaconRoot}/schema 
COPY --chown=${beaconUser}:${beaconUser} ./srvr   ${beaconRoot}/srvr
COPY --chown=${beaconUser}:${beaconUser} ./uix    ${beaconRoot}/uix
COPY --chown=${beaconUser}:${beaconUser} ./beacon-entrypoint.sh ${beaconRoot}/

EXPOSE 9001 8080

USER ${beaconUser}
ENTRYPOINT [ "/opt/beacon/beacon-entrypoint.sh" ]
