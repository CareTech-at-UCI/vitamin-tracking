"use client";
import HeightWeightCard from "./_components/HeightWeightCard";
import PersonalInfoCard from "./_components/PersonalInfoCard";
import ActivityLevelCards from "./_components/ActivityLevelCards";
import DietaryRestrictionCard from "./_components/DietaryRestrictionPlanCard";
import DietaryPlanCard from "./_components/DietaryPlanCard";

export default function Profile() {
    return (
        <div className = "flex flex-col items-flex-start">
            <div className="flex flex-row items-center gap-20">
                {/* Profile picture */}
                <div className="w-[200px] h-[200px] rounded-full bg-gray-200 flex-shrink-0">
                </div>
                {/* Profile text */}
                <div className="flex flex-col gap-2">
                    <h1
                        className="font-[Montserrat_Alternates] font-semibold text-[64px] leading-none tracking-[-8%] text-[#0A3323]"
                    >
                        Peter
                    </h1>

                    <p
                        className="font-[Instrument_Sans] font-medium text-[32px] leading-none tracking-[-8%] text-[#26612F]"
                    >
                        Peter T. Anteater
                    </p>
                </div>

                <HeightWeightCard
                    title="Height"
                    imperial={`5' 11"`}
                    metric="180.3 cm"
                />

                <HeightWeightCard
                    title="Weight"
                    imperial={165.4}
                    metric="75 kg"
                />
                </div>

            <div className="flex flex-row items-center gap-4">
                <PersonalInfoCard
                    title="Sex"
                    content="Male"
                />
                <PersonalInfoCard
                    title="Age"
                    content="24 yrs"
                />
            </div>
            <ActivityLevelCards selected="Moderate" />

            
        </div>
    );
}