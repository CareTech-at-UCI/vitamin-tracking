"use client";

import HeightWeightCard from "./_components/HeightWeightCard";
import PersonalInfoCard from "./_components/PersonalInfoCard";
import ActivityLevelCards from "./_components/ActivityLevelCards";
import DietaryRestrictionPlanCard from "./_components/DietaryRestrictionPlanCard";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/profile/api";
import { profilePictureToAvatarSrc } from "@/lib/profile/avatars";
import Image from "next/image";
import { HiPencil } from "react-icons/hi";

export default function Profile() {
    const [avatarSrc, setAvatarSrc] = useState(
        "/assets/avatars/tomato.svg"
    );
    const [name, setName] = useState("Peter T. Anteater");
    const [firstName, setFirstName] = useState("Peter");

    const [feet, setFeet] = useState(1);
    const [inches, setInches] = useState(1);
    const [metricHeight, setMetricHeight] = useState(1);

    const [weight, setWeight] = useState(1000);
    const [metricWeight, setMetricWeight] = useState(100.0);

    const [sex, setSex] = useState("Male");
    const [age, setAge] = useState(100);

    const [activity, setActivity] = useState("Sedentary");

    const [dietRestrictions, setDietRestrictions] =
        useState<string[]>([]);

    const [dietPlans, setDietPlans] =
        useState<string[]>([]);

    const calculateAge = (dateOfBirth: string) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        let age =
            today.getFullYear() -
            birthDate.getFullYear();

        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (
                today.getMonth() === birthDate.getMonth() &&
                today.getDate() >= birthDate.getDate()
            );

        if (!hasHadBirthdayThisYear) {
            age--;
        }

        return age;
    };

    const convertActivity = (currActivity: number) => {
        const activityLevels = [
            "Sedentary",
            "Light",
            "Moderate",
            "Very Active",
        ];

        return activityLevels[currActivity - 1] ?? "Sedentary";
    };

    useEffect(() => {
        getProfile()
            .then((data) => {
                if (data.profile_picture) {
                    setAvatarSrc(
                        profilePictureToAvatarSrc(
                            data.profile_picture
                        )
                    );
                }

                const firstNameValue = data.first_name ?? "";
                const lastNameValue = data.last_name ?? "";
                setName(`${firstNameValue} ${lastNameValue}`.trim());
                setFirstName(firstNameValue);

                const height = Number(data.height ?? 0);
                setFeet(Math.floor(height / 12));
                setInches(height % 12);
                setMetricHeight(Math.round(height * 2.54 * 10) / 10);

                const weight = Number(data.weight ?? 0);
                setWeight(weight);
                setMetricWeight(Math.round((weight / 2.20462) * 10) / 10);

                const sexValue = data.sex ?? "";
                setSex(sexValue ? sexValue.charAt(0).toUpperCase() + sexValue.slice(1): "");

                if (data.date_of_birth) {setAge(calculateAge(data.date_of_birth));}

                const activityLevel = Number(data.activity_level ?? 0);
                setActivity(convertActivity(activityLevel));

                setDietRestrictions((data.diet_restrictions ?? []).map((restriction) => restriction.name));

                setDietPlans((data.dietary_plans ?? []).map((plan) => plan.name));
            })
            .catch((error) => {
                console.error(
                    "Failed to fetch user profile:",
                    error
                );
            });
    }, []);

    return (
        <div className="flex w-full flex-col items-start gap-[1rem] p-[1.75rem]">

            {/* Profile Header */}
            <div className="flex w-full flex-col items-start gap-[1.5rem] p-[1.75rem]">
                <div className="flex origin-left flex-row items-center gap-[1vw] ">

                    {/* Profile picture */}
                    <Image
                        src={avatarSrc}
                        alt="Profile"
                        width={200}
                        height={200}
                        loading="eager"
                        className="h-[12.5rem] w-[12.5rem] shrink-0 rounded-full object-cover"
                    />

                    {/* Profile text */}
                    <div className="flex flex-col gap-[0.5rem]">
                        <h1
                            className="font-[Montserrat_Alternates] text-[clamp(2.5rem,4vw,4rem)] font-semibold leading-none tracking-[-8%] text-[#0A3323]"
                        >
                            {firstName}
                        </h1>

                        <p
                            className="font-[Instrument_Sans] text-[clamp(1.5rem,2vw,2rem)] font-medium leading-none tracking-[-2%] text-[#26612F]"
                        >
                            {name}
                        </p>
                    </div>

                    {/* Height */}
                    <div className="ml-[10vw]">
                        <HeightWeightCard
                            title="Height"
                            imperial={`${feet}’ ${inches}’’`}
                            metric={`${metricHeight} cm`}
                        />
                    </div>

                    {/* Weight */}
                    <HeightWeightCard
                        title="Weight"
                        imperial={weight}
                        metric={`${metricWeight} kg`}
                    />
                </div>

                {/* Edit Profile Button */}
                <button
                    type="button"
                    onClick={() => {}}
                    className="flex h-[2.5rem] w-[12vw] min-w-[9rem] items-center justify-center gap-[0.5rem] rounded-[2rem] bg-[#F16F33] px-[1.5rem] py-[0.5rem] font-[Instrument_Sans] text-[clamp(1rem,1.4vw,1.25rem)] font-medium leading-[100%] tracking-[-5%] text-[#FFFDEE]"
                >
                    <span>Edit Profile</span>
                    <HiPencil color="#FFFDEE" />
                </button>
            </div>

            {/* Personal Info */}
            <section className="flex w-full flex-col items-start">
                <h2
                    className="p-[1.75rem] font-[Montserrat_Alternates] text-[clamp(2rem,2.8vw,2.5rem)] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
                >
                    Personal Info
                </h2>

                <div className="flex flex-row items-center gap-[1vw] px-[1.5vw]">
                    <PersonalInfoCard
                        title="Sex"
                        content={sex}
                    />

                    <PersonalInfoCard
                        title="Age"
                        content={`${age} yrs`}
                    />
                </div>
            </section>

            {/* Activity Levels */}
            <section className="flex w-full flex-col items-start gap-[1.5rem] p-[1.75rem]">
                <h2
                    className="font-[Montserrat_Alternates] text-[clamp(2rem,2.8vw,2.5rem)] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
                >
                    Activity Levels
                </h2>

                <ActivityLevelCards
                    selected={activity as
                        | "Sedentary"
                        | "Light"
                        | "Moderate"
                        | "Very Active"}
                />
            </section>

            {/* Dietary Restrictions */}
            <section className="flex w-full flex-col items-start gap-[1.5rem] px-[1.5vw]">
                <h2
                    className="font-[Montserrat_Alternates] text-[clamp(2rem,2.8vw,2.5rem)] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
                >
                    Dietary Restrictions
                </h2>

                <DietaryRestrictionPlanCard
                    titles={dietRestrictions}
                />
            </section>

            {/* Dietary Plans */}
            <section className="flex w-full flex-col items-start gap-[1.5rem] px-[1.5vw] py-[3vh]">
                <h2
                    className="font-[Montserrat_Alternates] text-[clamp(2rem,2.8vw,2.5rem)] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
                >
                    Dietary Plans
                </h2>

                <DietaryRestrictionPlanCard
                    titles={dietPlans}
                />
            </section>
        </div>
    );
}
