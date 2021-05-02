const { AwsProvider } = require("@grucloud/provider-aws");
const assert = require("assert");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const { config } = provider;
  const { domainName, stage } = config;

  const vpc = await provider.makeVpc({
    name: "vpc",
    properties: () => ({
      CidrBlock: "10.1.0.0/16",
    }),
  });
  const ig = await provider.makeInternetGateway({
    name: "ig",
    dependencies: { vpc },
  });

  const subnet = await provider.makeSubnet({
    name: "subnet",
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "10.1.0.1/24",
    }),
  });

  const routeTable = await provider.makeRouteTable({
    name: "route-table",
    dependencies: { vpc, subnets: [subnet] },
  });

  const route = await provider.makeRoute({
    name: "route-ig",
    dependencies: { routeTable, ig },
  });

  const sg = await provider.makeSecurityGroup({
    name: "securityGroup",
    dependencies: { vpc, subnet },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      create: {
        Description: "Security Group Description",
      },
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
      ingress: {
        IpPermissions: [
          {
            FromPort: 80,
            IpProtocol: "tcp",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [
              {
                CidrIpv6: "::/0",
              },
            ],
            ToPort: 80,
          },
          {
            FromPort: 443,
            IpProtocol: "tcp",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [
              {
                CidrIpv6: "::/0",
              },
            ],
            ToPort: 443,
          },
          {
            FromPort: 22,
            IpProtocol: "tcp",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [
              {
                CidrIpv6: "::/0",
              },
            ],
            ToPort: 22,
          },
          {
            FromPort: -1,
            IpProtocol: "icmp",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [
              {
                CidrIpv6: "::/0",
              },
            ],
            ToPort: -1,
          },
        ],
      },
    }),
  });

  const eip = await provider.makeElasticIpAddress({
    name: "ip",
    properties: () => ({}),
  });

  // Allocate a server
  const server = await provider.makeEC2({
    name: "server",
    dependencies: {
      keyPair,
      subnet,
      securityGroups: [sg],
      eip,
    },
    properties: () => ({
      InstanceType: "t2.micro",
      ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
    }),
  });

  const domain = await provider.useRoute53Domain({
    name: domainName,
  });

  const hostedZoneName = `${domainName}.`;
  const hostedZone = await provider.makeHostedZone({
    name: hostedZoneName,
    dependencies: { domain },
    properties: ({}) => ({}),
  });

  const recordA = await provider.makeRoute53Record({
    name: `${hostedZoneName}-ipv4`,
    dependencies: { hostedZone, eip },
    properties: ({ dependencies: { eip } }) => {
      return {
        Name: hostedZoneName,
        Type: "A",
        ResourceRecords: [
          {
            Value: eip.live?.PublicIp,
          },
        ],
        TTL: 60,
      };
    },
  });

  return { vpc, ig, subnet, routeTable, sg, eip, server, hostedZone, recordA };
};

exports.createResources = createResources;

exports.createStack = async ({ config, stage }) => {
  // Create a AWS provider
  const provider = AwsProvider({ config, stage });
  const { keyPairName } = provider.config;
  assert(keyPairName);

  const keyPair = await provider.useKeyPair({
    name: keyPairName,
  });
  const resources = await createResources({ provider, resources: { keyPair } });
  return { provider, resources };
};
