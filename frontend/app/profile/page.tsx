"use client";
import HeightWeightCard from "./_components/HeightWeightCard";
import PersonalInfoCard from "./_components/PersonalInfoCard";
import DietaryRestrictionCard from "./_components/DietaryRestrictionCard";
import DietaryPlanCard from "./_components/DietaryPlanCard";

export default function Profile() {
    return (
        <div className = "flex flex-col items-flex-start">
            <div className = "flex flex-row items-center">
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
        </div>
    );
}