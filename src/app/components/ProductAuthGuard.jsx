
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function ProductAuthGuard({ children }) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isPending && !session?.user) {
            const callbackURL = encodeURIComponent(pathname);

            router.replace(`/signup?callbackURL=${callbackURL}`);
        }
    }, [isPending, session, pathname, router]);

    if (isPending) {
        return <p className="p-6 text-center">লোড হচ্ছে...</p>;
    }

    if (!session?.user) {
        return <p className="p-6 text-center">Signup page-এ পাঠানো হচ্ছে...</p>;
    }

    return children;
}