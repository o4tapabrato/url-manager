import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized Access !!!" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const body = await request.json();
        const { originalUrl, customSlug } = body;

        if (!originalUrl) {
            return NextResponse.json({ error: "original url is required" }, { status: 400 });
        }

        const shortCode = customSlug ? customSlug.trim() : Math.random().toString(36).substring(2, 8);

        const existingLink = await prisma.link.findUnique({
            where: { shortCode },
        });

        if (existingLink) {
            return NextResponse.json({ error: "Slug already taken" }, { status: 400 });
        }

        const newLink = await prisma.link.create({
            data: {
                originalUrl,
                shortCode,
                userId,
            }
        });

        return NextResponse.json(
            { message: "Link created successfully !!!", link: newLink },
            { status: 201 }
        );
    }
    catch (error) {
        console.log("Link creation error: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized !!!" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const links = await prisma.link.findMany({
            where: { userId: decoded.userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ links }, { status: 200 });
    }
    catch (error) {
        console.log("Error in fetching links: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}