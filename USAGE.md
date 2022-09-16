## Usage

The testing environment:

```
  beacon-nodejs-vue-1:      10.128.0.2:8080
  beacon-nodejs-hapi-1:     10.128.0.3:9001
  beacon-nodejs-mongodb-1:  10.128.0.4:27017
```

So to test you could...

Point your browser at:
  `https://10.128.0.2:8080`

(You'll need to accept the self-signed certificate).

or perhaps, install httpie into virtual python env, 
to test the api server:

```
python3 -m venv ~/Pyvirts/httpie
source ~/Pyvirts/httpie/bin/activate
https --verify=no https://10.128.0.3:9001/info
```

You can test the endpoints using the official client:

  - [beacon-verifier](https://github.com/ga4gh-beacon/beacon-verifier): official beacon endpoint tester :D

Run: `beacon-verifier --ssl-no-verify https://10.128.0.3:9001 2>/dev/null | jq '.entities[][] | select( .valid == true )'`

```json
{
  "name": "Inst-Dept Beacon",
  "url": "https://10.128.0.3:9001/configuration",
  "valid": true,
  "error": null
}
{
  "name": "Inst-Dept Beacon",
  "url": "https://10.128.0.3:9001/info",
  "valid": true,
  "error": null
}
```
