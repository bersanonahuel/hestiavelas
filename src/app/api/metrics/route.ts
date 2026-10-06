import { NextResponse } from "next/server";
import { getMetrics, incrementMetric } from "@/lib/db";

export async function GET() {
  try {
    const metrics = await getMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching metrics" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { type } = await request.json();
    if (type !== "pageViews" && type !== "whatsappClicks") {
      return NextResponse.json({ error: "Tipo de métrica inválido" }, { status: 400 });
    }
    const metrics = await incrementMetric(type);
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: "Error incrementing metric" }, { status: 500 });
  }
}
