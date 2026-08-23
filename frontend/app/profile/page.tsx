"use client";
import HeightWeightCard from "./_components/HeightWeightCard";
import PersonalInfoCard from "./_components/PersonalInfoCard";
import ActivityLevelCards from "./_components/ActivityLevelCards";
import DietaryRestrictionCard from "./_components/DietaryRestrictionPlanCard";
import DietaryPlanCard from "./_components/DietaryPlanCard";
import { useEffect, useState } from "react";
import { getOnboarding } from "@/lib/onboarding/api";
import { profilePictureToAvatarSrc } from "@/lib/profile/avatars";
import Image from 'next/image';

export default function Profile() {
    const [avatarSrc, setAvatarSrc] = useState("/assets/avatars/tomato.svg");
    const [name, setName] = useState("Peter T. Anteater");
    const [firstName, setFirstName] = useState("Peter");
    const [height, setHeight] = useState(1);
    const [feet, setFeet] = useState(1);
    const [inches, setInches] = useState(1);
    const [metricHeight, setMetricHeight] = useState(1)
    const [weight, setWeight] = useState(1000);
    const [metricWeight, setMetricWeight] = useState(100.0);
    const [sex, setSex] = useState("Male");
    const [age, setAge] = useState(100);
    const [activityNumeric, setActivityNumeric] = useState(0);
    const [activity, setActivity] = useState("sedentary");
    
    

    const calculateAge = (dateOfBirth: string) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

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
        const activityLevels = ["Sedantary", "Light", "Moderate", "Very Active"];
        return activityLevels[currActivity - 1];

    }
    
    useEffect(() => {
        getOnboarding()
            .then((data) => {
                setAvatarSrc(profilePictureToAvatarSrc(data.profile_picture));
                setName(`${data.first_name} ${data.last_name}`);
                setFirstName(`${data.first_name}`)
                const height = Number(data.height);
                setHeight(Number(height));
                setFeet(Math.floor(height/12));
                setInches(height % 12);
                setMetricHeight(Math.round(height * 2.54 * 10) / 10)
                setWeight(Number(data.weight));
                setMetricWeight(Math.round((Number(data.weight) / 2.20462) * 10) / 10);
                setSex(data.sex);
                setAge(calculateAge(data.date_of_birth));
                const activityLevel = Number(data.activity_level);
                setActivityNumeric(activityLevel);
                setActivity(convertActivity(activityLevel));

            })
            .catch(() => {
            });
    }, []);


    return (
        <div className = "flex flex-col items-flex-start gap-[20]">
            <div className="flex flex-row items-center gap-20 scale-75">
                {/* Profile picture */}
                <Image
                    src={avatarSrc}
                    alt="Profile"
                    width={200}
                    height={200}
                    loading="eager"
                    className="h-[200px] w-[200px] shrink-0 rounded-full object-cover"
                />
                {/* Profile text */}
                <div className="flex flex-col gap-2">
                    <h1
                        className="font-[Montserrat_Alternates] font-semibold text-[64px] leading-none tracking-[-8%] text-[#0A3323]"
                    >
                        {firstName}
                    </h1>

                    <p
                        className="font-[Instrument_Sans] font-medium text-[32px] leading-none tracking-[-2%] text-[#26612F]"
                    >
                        {name}
                    </p>
                </div>

                <HeightWeightCard
                    title="Height"
                    imperial={`${feet}’ ${inches}’’`}
                    metric={`${metricHeight} cm`}
                />

                <HeightWeightCard
                    title="Weight"
                    imperial={weight}
                    metric={`${metricWeight} kg`}
                />
                </div>

            <div className="flex flex-row items-center gap-4">
                <PersonalInfoCard
                    title="Sex"
                    content={sex.charAt(0).toUpperCase() + sex.slice(1)}
                />
                <PersonalInfoCard
                    title="Age"
                    content={`${age} yrs`}
                />
            </div>
            <ActivityLevelCards selected={activity} />
        </div>
    );
}