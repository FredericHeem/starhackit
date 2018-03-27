import faker from "faker";

export default function createFakeCandidateProfile(values) {
  return {
    ...values,
    summary: faker.lorem.sentences(),
    sectors: new Array(10).fill().map( () => faker.name.jobType()),
    geo: {
      type: "Point",
      coordinates: [
        faker.random.number({ min: 51, max: 52, precision: 0.01 }),
        faker.random.number({ min: -1, max: 1, precision: 0.01 })
      ]
    },
    location: {
      description: `${faker.address.city()} - ${faker.address.state()}`
    }
  };
}
