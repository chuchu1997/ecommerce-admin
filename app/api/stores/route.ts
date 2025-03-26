import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let userID = null;
    const body = await req.json();

    const { name } = body;

    if (!userID) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Store name is required", { status: 400 });
    }

    // const store = await prismadb.store.create({
    //   data: {
    //     name,
    //     userID: "11",
    //   },
    // });

    // return NextResponse.json(store);
  } catch (err) {
    console.log("[STORE_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
