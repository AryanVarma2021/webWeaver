import {PrismaClient} from "@prisma/client"

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare const globalThis : {
    prismaGolbal : ReturnType<typeof prismaClientSingleton>;
} & typeof global

const prisma = globalThis.prismaGolbal ?? prismaClientSingleton();

export default prisma

if(process.env.NODE_ENV !== "production") {
    globalThis.prismaGolbal = prisma
}