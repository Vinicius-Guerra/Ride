import { DriverFactory } from "../src/drivers/__tests__/factories";
import { prisma } from "./database";

async function resetDatabase() {
    await prisma.trip.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.driver.deleteMany();
    await prisma.car.deleteMany();
    await prisma.payment.deleteMany();
}

const DRIVER_AMOUNT = 10;

async function main() {
    // retornando estado inicial do banco
    resetDatabase();

    // Drivers
    const drivers = [];
    for(let i = 0; i <= DRIVER_AMOUNT; i++){
        const driver = DriverFactory.createWithCar();
        drivers.push(driver)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });