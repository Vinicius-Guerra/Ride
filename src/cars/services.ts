import { prisma } from "../../prisma/database";
import { CarPayload } from "./interfaces";

export const create = async (payload: CarPayload) => {
    const car = await prisma.car.findUnique({ where: { licensePlate: payload.licensePlate }});

    if(car) {
        throw new Error('License plate already used.')
    }

    const newCar = await prisma.car.create({ data: payload });

    return newCar
}
