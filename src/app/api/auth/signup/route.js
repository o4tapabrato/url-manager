import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from 'bcryptjs'

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, email, password, country } = body;

        if (!username || !email || !password || !country) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUsername = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUsername) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            )
        }

        //Hashing the password
        const hashedPassword = await bcrypt.hash(password, 7);

        //Creation of the user
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                country
            }
        });

        return NextRresponse.json(
            {
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    country: newUser.country,
                    createdAt: newUser.createdAt
                }
            },
            { status: 201 }
        );
    }
    catch(error) {
        console.error("Signup failed: ", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}