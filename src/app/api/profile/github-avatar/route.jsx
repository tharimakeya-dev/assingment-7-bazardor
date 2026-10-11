
import { NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth, database } from "@/lib/auth";

export async function GET() {
    await connection();

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Please log in first" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const userIds = [userId];

        if (ObjectId.isValid(userId)) {
            userIds.push(new ObjectId(userId));
        }

        const account = await database
            .collection("account")
            .findOne({
                providerId: "github",
                userId: { $in: userIds },
            });

        if (!account?.accessToken) {
            return NextResponse.json(
                { error: "GitHub account not linked" },
                { status: 404 }
            );
        }

        const response = await fetch(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${account.accessToken}`,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Could not load GitHub profile" },
                { status: 502 }
            );
        }

        const githubUser = await response.json();

        return NextResponse.json(
            {
                image: githubUser.avatar_url || null,
                login: githubUser.login || null,
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("GitHub avatar error:", error);

        return NextResponse.json(
            { error: "Failed to load GitHub avatar" },
            { status: 500 }
        );
    }
}
