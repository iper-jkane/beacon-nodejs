
### Availabe default synthetic data 

`jq -r '.[].name' models/datasets/defaultSynthetic.json`

  - CINECA_synthetic_cohort_EUROPE_UK1

> Quick import:

```bash
docker cp models/genomicVariations/CINECA_synthetic_cohort_EUROPE_UK1/example-gvars.json beacon-nodejs-mongodb-1:/var/tmp/
docker exec --user mongodb -it beacon-nodejs-mongodb-1 mongoimport -d beacon-nodejs -c genomicVariations --jsonArray /var/tmp/example-gvars.json
```
