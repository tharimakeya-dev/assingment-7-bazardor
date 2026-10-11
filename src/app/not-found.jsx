import Link from "next/link";

export default function NotFound() {
    return (<main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center"> <p className="text-7xl font-extrabold text-emerald-600">
        404 </p>


        <h1 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
            পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mt-3 max-w-md text-gray-500">
            দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।
            পেজের লিংকটি পরীক্ষা করে আবার চেষ্টা করুন।
        </p>

        <Link
            href="/"
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
            ← হোম পেজে ফিরে যান
        </Link>
    </main>


    );
}
