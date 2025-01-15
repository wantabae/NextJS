import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tasks = await prisma.task.findMany();
  return new Response(JSON.stringify(tasks), { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const task = await prisma.task.create({ data: body });
  return new Response(JSON.stringify(task), { status: 201 });
}
