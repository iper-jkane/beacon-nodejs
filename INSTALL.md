### Installation

Docker Compose
--------------

A docker compose environment is available for testing the implentation

Clone the repo and cd into the root directory:

```shell
git clone https://gitlab.com/xisc/beacon-nodejs
cd beacon-nodejs
```

Ensure the docker compose plugin is installed:

```
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.11.1/docker-compose-linux-x86_64 -o 
chmod 750 docker-compose 
```

Then use the docker compose commands to build / run the containers;<br/>
(this also creates a bride network using subnet: 10.128.0.0/29 ).
```
docker compose up -d 
```

Should give output similar to:

```
[+] Running 4/4
 ⠿ Network beacon-v2-net              Created
 ⠿ Container beacon-nodejs-vue-1      Started
 ⠿ Container beacon-nodejs-hapi-1     Started
 ⠿ Container beacon-nodejs-mongodb-1  Started
```

Test this worked:

`docker compose ls`:

```
NAME                STATUS              CONFIG FILES
beacon-nodejs       running(3)          /var/tmp/beacon-nodejs/docker-compose.yml
```

`docker compose ps`:

```
NAME                      COMMAND                  SERVICE             STATUS              PORTS
beacon-nodejs-hapi-1      "/opt/beacon/beacon-…"   hapi                running             9001/tcp
beacon-nodejs-mongodb-1   "docker-entrypoint.s…"   mongodb             running             27017/tcp
beacon-nodejs-vue-1       "/opt/beacon/beacon-…"   vue                 running             9001/tcp
```


Further Testing / Usage:
  
  see [USAGE.md](USAGE.md)
