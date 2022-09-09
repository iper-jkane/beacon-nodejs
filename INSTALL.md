### Installation

Docker Compose
--------------

A docker compose environment is available for testing the implentation

Clone the repo and cd into the root directory:

```shell
git clone https://gitlab.com/xisc/beacon-nodejs
cd beacon-nodejs
```

Use the docker compose commands to build / run the containers;
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

`docker compose status`:

```
NAME                      COMMAND                  SERVICE             STATUS              PORTS
beacon-nodejs-hapi-1      "/opt/beacon/beacon-…"   hapi                running             9001/tcp
beacon-nodejs-mongodb-1   "docker-entrypoint.s…"   mongodb             running             27017/tcp
beacon-nodejs-vue-1       "/opt/beacon/beacon-…"   vue                 running             9001/tcp
```


Further Testing / Usage:
  
  see USAGE.md
