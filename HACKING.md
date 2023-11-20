---

### Local hacking for fun and great science!

###### Clone the repository

```shell
git clone https://gitlab.com/xisc/beacon-nodejs
cd beacon-nodejs
```

###### Setup Node / Yarn virtual environment

- Install nodeenv into a python virtual environment
  
  ```shell
  python -mvenv --copies ~/pyvirts/nodeenv
  source ~/pyvirts/nodeenv/bin/activate
  pip install nodeenv
  ```

- Install nodejs into a node virtual environment and activate yarn
  
  ```shell
  nodeenv -n 16.15.1 ~/novirts/nodejs
  source ~/novirts/nodejs/bin/activate
  corepack enable yarn
  yarn config set --home enableTelemetry 0
  ```

##### Prepare environments

###### Mongoose schemas (required for the other two sub-projects)

- yarn / node
  
  ```shell
  cd schema/mongoose
  yarn install
  ```

###### Api / hapi server

- yarn / node
  
  ```shell
  cd ../../srvr/hapi
  yarn install
  ```

- plugin / db config (create .env file in the plugin directory)
  
  ```shell
  cat ./router/beacon/plugin/.env
  mdbHost=10.128.0.4
  mdbPort=27017
  mdbDbName=beacon-inst-dept
  ```

###### UI / web client

- yarn / node 
  
  ```shell
  cd ../../uix/vue
  yarn install
  ```

###### Going Forward

Subsequent sessions should only require re-activation of the nodeenv 
e.g,

```shell
source ~/novirts/nodejs/bin/activate
cd .../srvr/hapi
yarn serve 
# hack hack hack :D
```
