"use client";

import HeightWeightCard from "./_components/HeightWeightCard";
import PersonalInfoCard from "./_components/PersonalInfoCard";
import ActivityLevelCards from "./_components/ActivityLevelCards";
import DietaryRestrictionPlanCard from "./_components/DietaryRestrictionPlanCard";

import { useEffect, useState } from "react";
import { getOnboarding } from "@/lib/onboarding/api";
import { getUserDietRestrictions } from "@/lib/diet-restrictions/api";
import { getUserDietPlans } from "@/lib/dietary-plans/api";
import { profilePictureToAvatarSrc } from "@/lib/profile/avatars";
import Image from "next/image";

export default function Profile() {
    const [avatarSrc, setAvatarSrc] = useState(
        "/assets/avatars/tomato.svg"
    );
    const [name, setName] = useState("Peter T. Anteater");
    const [firstName, setFirstName] = useState("Peter");

    const [height, setHeight] = useState(1);
    const [feet, setFeet] = useState(1);
    const [inches, setInches] = useState(1);
    const [metricHeight, setMetricHeight] = useState(1);

    const [weight, setWeight] = useState(1000);
    const [metricWeight, setMetricWeight] = useState(100.0);

    const [sex, setSex] = useState("Male");
    const [age, setAge] = useState(100);

    const [activityNumeric, setActivityNumeric] = useState(0);
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
        getOnboarding()
            .then((data) => {
                setAvatarSrc(
                    profilePictureToAvatarSrc(
                        data.profile_picture
                    )
                );

                setName(
                    `${data.first_name} ${data.last_name}`
                );

                setFirstName(data.first_name);

                // Height
                const height = Number(data.height);

                setHeight(height);
                setFeet(Math.floor(height / 12));
                setInches(height % 12);

                setMetricHeight(
                    Math.round(height * 2.54 * 10) / 10
                );

                // Weight
                const weight = Number(data.weight);

                setWeight(weight);

                setMetricWeight(
                    Math.round(
                        (weight / 2.20462) * 10
                    ) / 10
                );

                // Personal information
                setSex(data.sex);
                setAge(
                    calculateAge(data.date_of_birth)
                );

                // Activity
                const activityLevel =
                    Number(data.activity_level);

                setActivityNumeric(activityLevel);
                setActivity(
                    convertActivity(activityLevel)
                );
            })
            .catch((error) => {
                console.error(
                    "Failed to fetch user data:",
                    error
                );
            });
    }, []);

    useEffect(() => {
        getUserDietRestrictions()
            .then((data) => {
                setDietRestrictions(
                    data.map(
                        (restriction) =>
                            restriction.name
                    )
                );
            })
            .catch((error) => {
                console.error(
                    "Failed to fetch dietary restrictions:",
                    error
                );
            });
    }, []);

    useEffect(() => {
        getUserDietPlans()
            .then((data) => {
                setDietPlans(
                    data.map((plan) => plan.name)
                );
            })
            .catch((error) => {
                console.error(
                    "Failed to fetch dietary plans:",
                    error
                );
            });
    }, []);

    return (
        <div className="flex w-full flex-col items-start gap-10 p-7">

            {/* Profile Header */}
            <div className="flex w-full flex-col items-start gap-6 p-7">
                <div className="flex origin-left flex-row items-center gap-20 scale-75">

                    {/* Profile picture */}
                    <Image
                        src={avatarSrc}
                        alt="Profile"
                        width={200}
                        height={200}
                        loading="eager"
                        className="h-[200px] w-[200px] shrink-0 ounded-full object-cover"
                    />

                    {/* Profile text */}
                    <div className="flex flex-col gap-2">
                        <h1
                            className="font-[Montserrat_Alternates] text-[64px] font-semibold leading-none tracking-[-8%] text-[#0A3323]"
                        >
                            {firstName}
                        </h1>

                        <p
                            className="font-[Instrument_Sans] text-[32px] font-medium leading-none tracking-[-2%] text-[#26612F]"
                        >
                            {name}
                        </p>
                    </div>

                    {/* Height */}
                    <HeightWeightCard
                        title="Height"
                        imperial={`${feet}’ ${inches}’’`}
                        metric={`${metricHeight} cm`}
                    />

                    {/* Weight */}
                    <HeightWeightCard
                        title="Weight"
                        imperial={weight}
                        metric={`${metricWeight} kg`}
                    />
                </div>

                {/* Edit Profile Button */}
                <button
                    className="flex h-[40px] w-[162.5px] items-center justify-center gap-1 rounded-[32px] bg-[#F16F33] px-6 py-2 font-[Instrument_Sans] text-[20px] font-medium leading-[100%] tracking-[-5%] text-[#FFFDEE]"
                >
                    Edit Profile
                </button>
            </div>

            {/* Personal Info */}
            <section className="flex w-full flex-col items-start gap-6">
                <h2
                    className="p-7 font-[Montserrat_Alternates] text-[40px] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
                >
                    Personal Info
                </h2>

                <div className="flex flex-row items-center gap-4">
                    <PersonalInfoCard
                        title="Sex"
                        content={
                            sex.charAt(0).toUpperCase() +
                            sex.slice(1)
                        }
                    />

                    <PersonalInfoCard
                        title="Age"
                        content={`${age} yrs`}
                    />
                </div>
            </section>

            {/* Activity Levels */}
            <section className="flex w-full flex-col items-start gap-6 p-7">
                <h2
                    className="font-[Montserrat_Alternates] text-[40px] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
                >
                    Activity Levels
                </h2>

                <ActivityLevelCards
                    selected={activity}
                />
            </section>

            {/* Dietary Restrictions */}
            <section className="flex w-full flex-col items-start gap-6">
                <h2
                    className="font-[Montserrat_Alternates] text-[40px] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
                >
                    Dietary Restrictions
                </h2>

                <DietaryRestrictionPlanCard
                    titles={dietRestrictions}
                />
            </section>

            {/* Dietary Plans */}
            <section className="flex w-full flex-col items-start gap-6">
                <h2
                    className="font-[Montserrat_Alternates] text-[40px] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
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