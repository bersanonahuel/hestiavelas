import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProducts, addProduct } from "@/lib/db";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("hestia_admin_auth")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, price, stock, imageUrl, featured } = body;

    if (!name || price === undefined || stock === undefined || !category) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (nombre, categoría, precio, stock)" },
        { status: 400 }
      );
    }

    const newProduct = await addProduct({
      name,
      description: description || "",
      category,
      price: Number(price),
      stock: Number(stock),
      imageUrl: imageUrl || "",
      featured: Boolean(featured),
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating product" }, { status: 500 });
  }
}
