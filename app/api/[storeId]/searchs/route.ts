import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";




export async function GET(
    req: Request,
  
    { params }: { params: { storeId: string } }
  ) {
    try {
        console.log("CO GOI NE ");
      const { storeId } = await params;
  
      if (!storeId) {
        return new NextResponse("Store Id is required ", { status: 400 });
      }
      

      const searchParams = new URL(req.url).searchParams;
      const query = searchParams.get("q");
  
      if (!query) {
        return NextResponse.json({ message: "Query parameter is required" }, { status: 400 });
      }
      console.log("QUERY",query);

      const products = await prismadb.product.findMany({
        where: {
          OR: [
            { name: { contains: query, } },
            { slug: { contains: query, } },
            { description: { contains: query,  } },
          ],
        },
      });
  
      console.log("PRODUCTS ",products);

      return NextResponse.json(products, { status: 200 });
    } catch (err) {
      console.log("[SEARCHS_GET]", err);
      return new NextResponse("Interal error", { status: 500 });
    }
  }