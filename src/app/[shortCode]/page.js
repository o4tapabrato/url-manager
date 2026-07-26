import { notFound, redirect } from "next/navigation";
import { prisma } from "../lib/prisma";

const RESERVED_ROUTES = ['login', 'signup', 'dashboard', 'api', '_next', 'favicon.ico'];

export default async function CatchAllRedirectPage({ params }) {
    const resolvedParams = await params;
    const slugSegments = resolvedParams?.slug;

    // Ensure we only look at the first segment (e.g., links like /pw1)
    const shortCode = slugSegments?.[0];

    if (!shortCode || RESERVED_ROUTES.includes(shortCode)) {
        return notFound();
    }

    try {
        const link = await prisma.link.update({
            where: { shortCode: String(shortCode).trim() },
            data: {
                clicksCount: {
                    increment: 1
                }
            }
        });

        if (!link || !link.originalUrl) {
            return notFound();
        }

        redirect(link.originalUrl);
    } catch (error) {
        console.error("Redirect error for code:", shortCode, error.message);
        return notFound();
    }
}