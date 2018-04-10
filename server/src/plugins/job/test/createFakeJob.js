import faker from "faker";

export default function createFakeJob(values) {
  return {
    ...values,
    title: faker.name.jobTitle(),
    description: faker.lorem.sentences(),
    company_name: faker.company.companyName(),
    company_info: faker.company.catchPhrase(),
    company_url: faker.internet.url(),
    business_type: faker.commerce.department(),
    company_logo_url: faker.image.imageUrl(),
    start_date: faker.date.future(),
    end_date: faker.date.future(),
    sector: faker.name.jobType(),
    geo: {
      type: "Point",
      coordinates: [
        faker.random.number({ min: 51, max: 52, precision: 0.01 }),
        faker.random.number({ min: -1, max: 1, precision: 0.01 })
      ]
    },
    location: {
      description: `${faker.address.city()} - ${faker.address.state()}`
    },
    rate_min: faker.random.number({ min: 10, max: 15, precision: 1 }),
    rate_max: faker.random.number({ min: 15, max: 30, precision: 1 }),
    rate_period: "hour",
    currency: "USD"
  };
}
