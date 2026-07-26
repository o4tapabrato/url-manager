import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    try {
        const link = await prisma.link.update({
            where: { shortCode: code.trim() },
            data: {
                clicksCount: {
                    increment: 1
                }
            }
        });

        if (!link || !link.originalUrl) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ originalUrl: link.originalUrl }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal error" }, { status: 404 });
    }
}