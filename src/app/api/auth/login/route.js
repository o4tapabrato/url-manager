import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        //validation phase
        if (!username || !password) {
            return NextResponse.json(
                { error: "Required fields are missing!!!" },
                { status: 400 }
            );
        }

        //searching by username
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Username doesn't exist" },
                { status: 401 }
            );
        }

        //password check
        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return NextResponse.json(
                { error: "Username and password didn't match !!!" },
                { status: 401 }
            );
        }

        //creating the jwt token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        //creating the response
        const response = NextResponse.json(
            {
                message: "Login successful !!!",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.emal
                },
            },
            { status: 200 }
        )

        //token setup
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true, //prevents javascript access
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        })

        //sending the access token
        return response;
    }
    catch (error) {
        console.log("Login error: ", error);
        return NextResponse.json(
            { error: "Internal Server Error !!!" },
            { status: 500 }
        );
    }
}