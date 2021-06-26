const url = "https://github.com/grucloud/grucloud/";
const branch = "main";

export const PROJECTS = {
  aws: [
    {
      title: "EC2 an instance with public address",
      description:
        "Deploy a EC2 virtual machine attached to an elastic public address",
      url,
      branch,
      directory: "examples/aws/ec2",
    },
    {
      title: "EKS",
      description: "Deploy a kubernetes cluster with EKS",
      url,
      branch,
      directory: "packages/modules/aws/eks/example",
    },
  ],
  azure: [
    {
      title: "Virtual machine",
      description:
        "Deploy a virtual machine with a public address, protected by a firewall",
      url,
      branch,
      directory: "examples/azure",
    },
  ],
  google: [
    {
      title: "Virtual machine",
      description: "Deploy a virtual machine on the default network",
      resources: ["compute.instance"],
      url,
      branch,
      directory: "examples/google/vm",
    },
    {
      title: "Virtual machine inside a network",
      description:
        "Create a network, a sub-network, a virtual machine and firewall rules for HTTP/HTTPS",
      url,
      branch,
      directory: "examples/google/vm-network",
      resources: [
        "compute.network",
        "compute.subnetwork",
        "compute.subnetwork",
      ],
    },
    {
      title: "Secure static webite",
      description: "Deploy a static website served with HTTPS",
      url,
      branch,
      directory: "examples/google/storage-https",
    },
    {
      title: "DNS records",
      description: "Manages DNS records such as A, CNAME, TXT and MX records",
      url,
      branch,
      directory: "examples/google/dns/github-page",
    },
  ],
};
