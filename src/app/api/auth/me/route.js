import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { isValueExpired } from "next/dist/client/components/segment-cache/cache-map";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
    try {
        const token = request.cookies.get('auth_token')?.value;

        if(!token) {
            return NextResponse.json(
                { error: "Unauthorized "},
                { status: 401 }
            )
        }

        //verification
        const decoded = jwt.verify(token, JWT_SECRET);

        return NextResponse.json(
            { user: decoded },
            { status: 200 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 }
        );
    }
}