/** @format */

import { useAuth } from "@/hooks/auth/useAuth";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isAuthenticated } = useAuth();

    const body = await req.json();

    const { name } = body;

    if (!isAuthenticated) {
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
