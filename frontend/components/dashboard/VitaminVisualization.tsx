import { CircularProgressBar } from "./CircularProgressBar";

export function VitaminVisualization() {
    return (
        <div className="flex-[473] border-2 border-[#26612F] rounded-2xl py-8 px-8">
            <h2 className="font-display text-[2.5rem] font-semibold leading-none tracking-[-0.08em] text-[#0A3323] text-center">Vitamin Visualization</h2>
            <div className="flex justify-center mt-6">
                <CircularProgressBar percentage={28} vitaminName="Vitamin A" />
            </div>
        </div>
    );
}
