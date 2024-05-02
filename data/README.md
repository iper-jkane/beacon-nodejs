
### Availabe default synthetic data (suitable for public use under GDPR)

`jq -r '.[].name' models/datasets/defaultSynthetic.json`

  - CINECA_synthetic_cohort_EUROPE_UK1

### Example user authentication data (must be changed before moving to production!)

see:
  - auth/beaconAuthUsers.json

> Quick import:

The data is made available to the mongodb service via a bind-mount volume, which is specified in the docker-compose.yml config file.

By default:
  - ./data:/var/data/import

To import the example data into the database itself:

```bash
docker exec --user mongodb -it beacon-nodejs-mongodb-1 mongoimport -d beacon-nodejs -c genomicVariations --jsonArray /var/data/import/models/genomicVariations/CINECA_synthetic_cohort_EUROPE_UK1/example-gvars.json
```

and to import the example auth data:

```bash
docker exec --user mongodb -it beacon-nodejs-mongodb-1 mongoimport -d beacon-nodejs -c beaconAuthUsers --jsonArray /var/data/import/auth/beaconAuthUsers.json
```
