# Deploy infrastructure on AWS with GruCloud

This directory contains the code to deploy and destroy the instructure on AWS with [grucloud](https://grucloud.com).

The following resources are defined in [iac](./iac.js):

- Vpc
- Internet Gateway
- Subnet
- Route Table
- Security Group
- Elastic Ip Address
- EC2 Instance.
- Route53 Domain
- Route53 Hosted Zone
- Route53 Record

Visit [AwsRequirements](https://www.grucloud.com/docs/aws/AwsRequirements) and ensure the _aws cli_ is configured properly.

Edit [config/default.js](config/default.js) and change the domain name and the key pair name.

Install the _gc CLI_ globally:

```sh
npm i -g @grucloud/core
```

Install the dependencies

```sh
npm i
```

Generate a graph of the infrastrucure:s

```sh
gc graph
```

![Graph](grucloud.svg)

Deploy the infrastructure with:

```sh
gc apply
```

List the running resources:

```sh
gc list
```

Destroy the running resources:

```sh
gc destroy
```
