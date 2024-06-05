//import { TripStatus } from "@prisma/client";

import { faker } from "@faker-js/faker";
import { hash } from "bcryptjs";
import { prisma } from "./database";
import { DriverFactory } from "../src/drivers/__tests__/factories";
import { CustomerFactory } from "../src/customers/__tests__/factories";
//import { PaymentFactory } from "../../payments/__tests__/factories";

async function resetDatabase() {
  await prisma.trip.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.car.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.payment.deleteMany();
}

const DRIVER_AMOUNT = 102;
const CUSTOMER_AMOUNT = DRIVER_AMOUNT;
const TRIPS_COMPLETED = CUSTOMER_AMOUNT * 100;
const TRIPS_IN_PROGRESS = CUSTOMER_AMOUNT / 2;
const MAX_FUTURE_HOURS_UPDATED_AT = 25;
const DEFAULT_DRIVER_PASSWORD = "1234";
const DEFAULT_CUSTOMER_PASSWORD = "ABCD";

async function main() {
  // RESETANDO O ESTADO INICIAL DO BANCO
  resetDatabase();

  // DRIVERS
  const drivers = [];
  for (let i = 0; i < DRIVER_AMOUNT; i++) {
    const driver = await DriverFactory.createWithCar({
      password: await hash(DEFAULT_DRIVER_PASSWORD, 10),
    });
    drivers.push(driver);
  }

  // CUSTOMERS
  const customers = [];
  for (let i = 0; i < CUSTOMER_AMOUNT; i++) {
    const customer = await CustomerFactory.create({
      password: await hash(DEFAULT_CUSTOMER_PASSWORD, 10),
    });
    customers.push(customer);
  }

//   // IN_PROGRESS TRIPS
//   const tripsInProgress = [];
//   for (let i = 0; i < TRIPS_IN_PROGRESS; i++) {
//     const payment = await PaymentFactory.create();

//     const tripRelationships = {
//       driverId: drivers[i].id,
//       customerId: customers[i].id,
//       paymentId: payment.id,
//     };

//     const tripInProgress = await TripFactory.create(tripRelationships);
//     tripsInProgress.push(tripInProgress);
//   }

//   const fromDatetime = new Date();
//   const toDatetime = new Date(
//     fromDatetime.getTime() + MAX_FUTURE_HOURS_UPDATED_AT * 60 * 60 * 1000
//   );

//   // COMPLETED TRIPS
//   const tripsCompleted = [];
//   for (let i = 0; i < TRIPS_COMPLETED; i++) {
//     const driverRandomIndex = Math.floor(Math.random() * DRIVER_AMOUNT);
//     const customerRandomIndex = Math.floor(Math.random() * CUSTOMER_AMOUNT);

//     const randomDriver = drivers[driverRandomIndex];
//     const randomCustomer = customers[customerRandomIndex];

//     const payment = await PaymentFactory.create();

//     const tripRelationships = {
//       driverId: randomDriver.id,
//       customerId: randomCustomer.id,
//       paymentId: payment.id,
//     };

//     const tripCompleted = await TripFactory.create(tripRelationships, {
//       status: TripStatus.COMPLETED,
//       updatedAt: faker.date.between({ from: fromDatetime, to: toDatetime }),
//     });
//     tripsCompleted.push(tripCompleted);
//   }

//   console.log(drivers[0]);
//   console.log(customers[0]);
//   console.log(tripsInProgress[0]);
//   console.log(tripsCompleted[0]);
// }

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
}