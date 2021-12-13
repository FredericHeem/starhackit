const { AwsProvider } = require("@grucloud/provider-aws");
const assert = require("assert");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const { config } = provider;
  const { domainName, stage } = config;

  const AvailabilityZone = `${config.region}${config.availabilityZoneSuffix}`;

  const Device = "/dev/sdf";
  const deviceMounted = "/dev/xvdf";
  const mountPoint = "/data";
  const vpc = provider.EC2.makeVpc({
    name: "vpc",
    properties: () => ({
      CidrBlock: "10.1.0.0/16",
    }),
  });
  const ig = provider.EC2.makeInternetGateway({
    name: "ig",
    dependencies: { vpc },
  });

  const subnet = provider.EC2.makeSubnet({
    name: "subnet",
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "10.1.0.1/24",
      AvailabilityZone,
    }),
  });

  const routeTable = provider.EC2.makeRouteTable({
    name: "route-table",
    dependencies: { vpc, subnets: [subnet] },
  });

  const route = provider.EC2.makeRoute({
    name: "route-ig",
    dependencies: { routeTable, ig },
  });

  const securityGroup = provider.EC2.makeSecurityGroup({
    name: "securityGroup",
    dependencies: { vpc, subnet },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      Description: "Security Group Description",
    }),
  });
  const sgRuleIngressSsh = provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-ssh",
    dependencies: {
      securityGroup,
    },
    properties: () => ({
      IpPermission: {
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
    }),
  });
  const sgRuleIngressHttp = provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-http",
    dependencies: {
      securityGroup,
    },
    properties: () => ({
      IpPermission: {
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
    }),
  });
  const sgRuleIngressHttps = provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-https",
    dependencies: {
      securityGroup,
    },
    properties: () => ({
      IpPermission: {
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
    }),
  });
  const sgRuleIngressIcmp = provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-icmp",
    dependencies: {
      securityGroup,
    },
    properties: () => ({
      IpPermission: {
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
    }),
  });

  const eip = provider.EC2.makeElasticIpAddress({
    name: "ip",
  });

  const image = provider.EC2.useImage({
    name: "ubuntu 20.04",
    properties: () => ({
      Filters: [
        {
          Name: "architecture",
          Values: ["x86_64"],
        },
        {
          Name: "description",
          Values: ["Canonical, Ubuntu, 20.04 LTS, amd64 focal*"],
        },
      ],
    }),
  });

  const volume = provider.EC2.makeVolume({
    name: "volume",
    properties: () => ({
      Size: 10,
      VolumeType: "standard",
      Device,
      AvailabilityZone,
    }),
  });

  // Allocate a server
  const server = provider.EC2.makeInstance({
    name: "server",
    dependencies: {
      keyPair,
      subnet,
      securityGroups: [securityGroup],
      eip,
      image,
      volumes: [volume],
    },
    properties: () => ({
      UserData: volume.spec.setupEbsVolume({ deviceMounted, mountPoint }),
      InstanceType: "t2.micro",
      Placement: { AvailabilityZone },
    }),
  });

  const domain = provider.Route53Domains.useDomain({
    name: domainName,
  });

  const hostedZoneName = `${domainName}.`;
  const hostedZone = provider.Route53.makeHostedZone({
    name: hostedZoneName,
    dependencies: { domain },
    properties: ({}) => ({}),
  });

  const recordA = provider.Route53.makeRecord({
    name: `app.${hostedZoneName}`,
    dependencies: { hostedZone, eip },
    properties: ({ dependencies: { eip } }) => {
      return {
        Name: `app.${hostedZoneName}`,
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

  const recordAGitPage = provider.Route53.makeRecord({
    name: `${hostedZoneName}`,
    dependencies: { hostedZone },
    properties: ({ dependencies }) => {
      return {
        Name: `${hostedZoneName}`,
        Type: "A",
        ResourceRecords: [
          {
            Value: "185.199.108.153",
          },
          {
            Value: "185.199.109.153",
          },
        ],
        TTL: 86400,
      };
    },
  });
  const recordWww = provider.Route53.makeRecord({
    name: `${hostedZoneName}-gitpage-record-www`,
    dependencies: { hostedZone },
    properties: () => {
      return {
        Name: `www.${hostedZoneName}`,
        Type: "CNAME",
        ResourceRecords: [
          {
            Value: "grucloud.github.io.",
          },
        ],
        TTL: 86400,
      };
    },
  });

  const recordMx = provider.Route53.makeRecord({
    name: `${hostedZoneName}-mx`,
    dependencies: { hostedZone },
    properties: () => {
      return {
        Name: `${hostedZoneName}`,
        Type: "MX",
        ResourceRecords: [
          {
            Value: "1 ASPMX.L.GOOGLE.COM.",
          },
          {
            Value: "5 ALT1.ASPMX.L.GOOGLE.COM.",
          },
        ],
        TTL: 86400,
      };
    },
  });
  return {
    vpc,
    ig,
    subnet,
    routeTable,
    securityGroup,
    eip,
    server,
    //hostedZone, recordA
  };
};

exports.createResources = createResources;

//TODO
exports.createStack = async ({ config, stage }) => {
  // Create a AWS provider
  const provider = AwsProvider({ config, stage });
  const { keyPairName } = provider.config;
  assert(keyPairName);

  const keyPair = provider.EC2.useKeyPair({
    name: keyPairName,
  });
  const resources = await createResources({ provider, resources: { keyPair } });
  return { provider, resources };
};
