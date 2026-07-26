import { HTTPAccessFallbackBoundary } from 'next/dist/server/app-render/entry-base';
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
    )

    //clearing the cookie
    response.cookies.set({
        name: 'auth_token',
        value: '',
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    })

    return response;
}