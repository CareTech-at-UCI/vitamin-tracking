import Link from "next/link";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-[#FFFDEE] px-16 py-8 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-5xl font-bold text-[#171717]">Dashboard</h1>
                <Link
                    href="/profile"
                    className="bg-[#26612F] text-white text-sm font-medium px-5 py-2 rounded-full"
                >
                    Profile Info
                </Link>
            </div>

            {/* Two-box row */}
            <div className="flex flex-col md:flex-row gap-10">

                {/* Vitamin Goals — 832 units wide */}
                <div className="flex-[832] border-2 border-[#26612F]/20 rounded-2xl py-8 px-8">
                    <h2 className="text-xl font-bold">Vitamin Goals</h2>
                </div>

                {/* Vitamin Visualization — 473 units wide */}
                <div className="flex-[473] border-2 border-[#26612F]/20 rounded-2xl py-8 px-8">
                    <h2 className="text-xl font-bold">Vitamin Visualization</h2>
                </div>

            </div>

            {/* Food Recommendations label */}
            <h2 className="text-2xl font-bold">Food Recommendations</h2>

            {/* Recent Food button — bottom right */}
            <div className="flex justify-end">
                <Link
                    href="/recent-foods"
                    className="bg-[#26612F] text-white text-sm font-medium px-5 py-2 rounded-full"
                >
                    Recent Food
                </Link>
            </div>

        </main>
    );
}
