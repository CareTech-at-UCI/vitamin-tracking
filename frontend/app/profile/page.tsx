"use client";

// All styling according to figma

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
    const [loading, setLoading] = useState(true);

    const [avatarSrc, setAvatarSrc] = useState(
        "/assets/avatars/tomato.svg"
    );
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");

    const [feet, setFeet] = useState(0);
    const [inches, setInches] = useState(0);
    const [metricHeight, setMetricHeight] = useState(0);

    const [weight, setWeight] = useState(0);
    const [metricWeight, setMetricWeight] = useState(0);

    const [sex, setSex] = useState("");
    const [age, setAge] = useState(0);

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
                setSex(sexValue ? sexValue.charAt(0).toUpperCase() + sexValue.slice(1) : "");

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
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <p className="font-[Instrument_Sans] text-lg text-[#26612F]">
                    Loading profile...
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-w-0 w-full flex-col items-start max-lg:gap-6 max-lg:p-4 gap-[1rem] lg:gap-[0.5rem] p-[1.75rem] lg:p-[0.875rem]">

            {/* Profile Header */}
            <div className="flex min-w-0 w-full flex-col items-start max-lg:gap-4 max-lg:p-0 gap-[1.5rem] lg:gap-[0.75rem] p-[1.75rem] lg:p-[0.875rem]">
                    <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-4 lg:flex lg:flex-wrap lg:gap-[1vw]">

                        {/* Profile picture */}
                        <Image
                            src={avatarSrc}
                            alt="Profile"
                            width={200}
                            height={200}
                            loading="eager"
                            className="h-20 w-20 sm:h-24 sm:w-24 lg:h-[6.25rem] lg:w-[6.25rem] shrink-0 rounded-full object-cover"
                        />

                        {/* Profile text */}
                        <div className="flex min-w-0 flex-col break-words gap-[0.5rem] lg:gap-[0.25rem]">
                            <h1
                                className="font-[Montserrat_Alternates] text-2xl sm:text-3xl lg:text-[clamp(1.25rem,2vw,2rem)] font-semibold leading-none tracking-[-8%] text-[#0A3323]"
                            >
                                {firstName}
                            </h1>

                            <p
                                className="font-[Instrument_Sans] text-base sm:text-lg lg:text-[clamp(0.75rem,1vw,1rem)] font-medium leading-none tracking-[-2%] text-[#26612F]"
                            >
                                {name}
                            </p>
                        </div>

                        <div className="col-span-2 lg:order-last lg:w-full">
                            {/* Edit Profile Button, CHANGE HREF WHEN EDITING IS IMPLEMENTED */}
                            <button
                                type="button"
                                onClick={() => {}}
                                className="inline-flex w-auto items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#F16F33] px-4 py-2 font-[Instrument_Sans] text-base font-medium text-[#FFFDEE]"
                            >
                                <span>Edit Profile</span>
                                <HiPencil color="#FFFDEE" />
                            </button>
                        </div>

                        <div className="col-span-2 grid w-full min-w-0 grid-cols-2 gap-3 sm:gap-6 lg:ml-[5vw] lg:mt-5 lg:w-auto">
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
                    </div>


            </div>

            {/* Personal Info: Age + Sex */}
            <section className="flex w-full flex-col items-start">
                <h2
                    className="max-lg:p-0 max-lg:pb-4 p-[1.75rem] lg:p-[0.875rem] font-[Montserrat_Alternates] text-xl sm:text-2xl lg:text-[clamp(1rem,1.4vw,1.25rem)] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
                >
                    Personal Info
                </h2>

                <div className="grid w-full grid-cols-2 gap-3 sm:gap-6 lg:flex lg:gap-[0.5vw] lg:px-[0.75vw]">
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
            <section className="flex min-w-0 w-full flex-col items-start max-lg:gap-4 max-lg:p-0 gap-[1.5rem] lg:gap-[0.75rem] p-[1.75rem] lg:p-[0.875rem]">
                <h2
                    className="font-[Montserrat_Alternates] text-xl sm:text-2xl lg:text-[clamp(1rem,1.4vw,1.25rem)] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323] pb-[0.5rem] lg:pb-[0.25rem]"
                >
                    Activity Levels
                </h2>

                <ActivityLevelCards selected={ activity as | "Sedentary" | "Light" | "Moderate" | "Very Active" }/>
            </section>

            {/* Dietary Restrictions */}
            <section className="flex min-w-0 w-full flex-col items-start max-lg:gap-4 max-lg:p-0 gap-[1.5rem] lg:gap-[0.75rem] px-[1.5vw] lg:px-[0.75vw]">
                <h2
                    className="font-[Montserrat_Alternates] text-xl sm:text-2xl lg:text-[clamp(1rem,1.4vw,1.25rem)] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323] pb-[0.5rem] lg:pb-[0.25rem]"
                >
                    Dietary Restrictions
                </h2>

                <DietaryRestrictionPlanCard
                    titles={dietRestrictions}
                    emptyMessage="No dietary restrictions added yet."
                />
            </section>

            {/* Dietary Plans */}
            <section className="flex min-w-0 w-full flex-col items-start max-lg:gap-4 max-lg:p-0 gap-[1.5rem] lg:gap-[0.75rem] px-[1.5vw] lg:px-[0.75vw] py-[3vh] lg:py-[1.5vh]">
                <h2
                    className="font-[Montserrat_Alternates] text-xl sm:text-2xl lg:text-[clamp(1rem,1.4vw,1.25rem)] font-semibold leading-[100%] tracking-[-8%] text-[#0A3323]"
                >
                    Dietary Plans
                </h2>

                <DietaryRestrictionPlanCard
                    titles={dietPlans}
                    emptyMessage="No dietary plans added yet."
                />
            </section>
        </div>
    );
}
