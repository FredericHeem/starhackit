export default {
  infraName: {
    presence: true,
    length: {
      minimum: 3,
      message: "must be at least 3 characters",
    },
  },
  accessKeyId: {
    presence: true,
    length: {
      minimum: 3,
      message: "must be at least 20 characters",
    },
  },
  secretKey: {
    presence: true,
    length: {
      minimum: 3,
      message: "must be at least 40 characters",
    },
  },
};
