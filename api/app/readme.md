## Redis
Run locally
`redis-server`

Live @ app.redislabs.com
Name: beaniedb

##### connecting
redis-cli -h <host> -a <pass> -p 19395


## SOPS

export AWS_ACCESS_KEY_ID=<id>
export AWS_SECRET_ACCESS_KEY=<key>
##### encrypt
sops -e tfvars.json > secrets.tfvars.json
