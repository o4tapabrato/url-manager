import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function DELETE(request, { params }) {
    try {
        const token = request.cookies.get('auth_token')?.value;

        if(!token) {
            return NextResponse.json(
                { error: "Unauthorized !!!" },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const resolvedParams = await params;
        const linkId = resolvedParams?.id;

        if(!linkId) {
            return NextResponse.json(
                { error: "Link Id is missing !!!" },
                { status: 400 }
            )
        }

        //verification
        const link = await prisma.link.findUnique({
            where: { id: linkId }
        });

        if(!link || link.userId !== decoded.userId) {
            return NextResponse.json(
                { error: "Link error" },
                { status: 404 }
            )
        }

        //databse deletion
        await prisma.link.delete({
            where: { id: linkId }
        });

        return NextResponse.json(
            { message: "Link has been deleted successfully !!!" },
            { status: 200 }
        )
    }
    catch (error) {
        console.log("Error deleting the link: ", error);
        return NextResponse.json(
            { error: "Internal Server Error !!!" },
            { status: 500 }
        );
    }
}