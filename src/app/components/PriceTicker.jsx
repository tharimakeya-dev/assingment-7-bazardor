
"use client";

const prices = [
    {
        name: "চাল (মিনিকেট)",
        price: "৬৫ টাকা/কেজি",
        change: "২.৭%",
        direction: "up",
        icon: "🍚",
    },
    {
        name: "তেল (সয়াবিন)",
        price: "১৭৫ টাকা/লিটার",
        change: "১.২%",
        direction: "up",
        icon: "🫙",
    },
    {
        name: "পেঁয়াজ",
        price: "৪০ টাকা/কেজি",
        change: "০.৯%",
        direction: "down",
        icon: "🧅",
    },
    {
        name: "টমেটো",
        price: "৩০ টাকা/কেজি",
        change: "৮.৬%",
        direction: "up",
        icon: "🍅",
    },
    {
        name: "আলু",
        price: "২৫ টাকা/কেজি",
        change: "১.৮%",
        direction: "down",
        icon: "🥔",
    },
];

export default function PriceTicker() {
    return (
        <div
            className="price-ticker-wrapper"
            aria-label="বাজারদরের আপডেট"
        >
            <div className="price-ticker-track">
                {[0, 1].map((group) => (
                    <div
                        className="price-ticker-group"
                        key={group}
                        aria-hidden={group === 1 ? "true" : undefined}
                    >
                        {prices.map((item) => (
                            <div className="price-item" key={item.name}>
                                <span className="price-icon">
                                    {item.icon}
                                </span>

                                <span className="price-name">
                                    {item.name}
                                </span>

                                <span className="price-value">
                                    {item.price}
                                </span>

                                <span
                                    className={
                                        item.direction === "up"
                                            ? "price-up"
                                            : "price-down"
                                    }
                                >
                                    {item.direction === "up" ? "▲" : "▼"}{" "}
                                    {item.change}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}