const url = "https://github.com/grucloud/grucloud/";

export const PROJECTS = {
  AWS: [
    {
      title: "EC2 an instance with public address",
      description:
        "Deploy a EC2 virtual machine attached to an elastic public address",
      url,
      directory: "examples/aws/ec2",
    },
    {
      title: "EKS",
      description: "Deploy a kubernetes cluster with EKS",
      url,
      directory: "packages/modules/aws/eks/example",
    },
  ],
  Azure: [
    {
      title: "Virtual machine",
      description:
        "Deploy a virtual machine with a public address, protected by a firewall",
      url,
      directory: "examples/azure",
    },
  ],
  GCP: [
    {
      title: "Virtual machine",
      description: "Deploy a virtual machine on the default network",
      resources: ["compute.instance"],
      url,
      directory: "examples/google/vm",
    },
    {
      title: "Virtual machine inside a network",
      description:
        "Create a network, a sub-network, a virtual machine and firewall rules for HTTP/HTTPS",
      url,
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
      directory: "examples/google/storage-https",
    },
    {
      title: "DNS records",
      description: "Manages DNS records such as A, CNAME, TXT and MX records",
      url,
      directory: "examples/google/dns/github-page",
    },
  ],
};
