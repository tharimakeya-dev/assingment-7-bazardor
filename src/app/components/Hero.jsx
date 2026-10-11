import Image from "next/image";

export default function Hero() {
    return (
        <section className="bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                <div className="grid min-h-[350px] overflow-hidden rounded-2xl bg-gradient-to-r from-green-50 to-green-100 lg:grid-cols-2">

                    {/* LEFT */}
                    <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">

                        {/* Eyebrow */}
                        <p className="mb-4 w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            🌿 আজকের বাজার দর
                        </p>

                        {/* Heading */}
                        <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            আপনার প্রতিদিনের
                            <span className="block text-green-600">
                                সঠিক বাজার দর
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-4 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
                            দেশের বিভিন্ন বাজারের সবজি, ফল, মাছ, মাংস,
                            ডাল, তেলসহ নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ
                            দাম জানুন এক জায়গায়।
                        </p>

                        {/* CTA */}
                        <div className="mt-6">
                            <a
                                href="#সব-পণ্য"
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                বাজার দর দেখুন
                                <span>→</span>
                            </a>
                        </div>

                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="flex min-h-[280px] items-end justify-center lg:min-h-[350px]">

                        <Image
                            src="/bazar-hero.png"
                            alt="বাজারের তাজা সবজি"
                            width={650}
                            height={450}
                            priority
                            className="h-auto w-full max-w-[600px] object-contain"
                        />

                    </div>

                </div>

            </div>
        </section>
    );
}