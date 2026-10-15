"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import {
    getProfile,
    updateProfile,
    updateProfileDietaryPlans,
    updateProfileDietRestrictions,
    type Profile,
    type ProfilePicture,
    type Sex,
} from "@/lib/profile/api";
import { AVATAR_ASSETS, type AvatarId } from "@/lib/profile/avatars";
import { getPresetDietRestrictions } from "@/lib/diet-restrictions/api";
import { getPresetDietaryPlans } from "@/lib/dietary-plans/api";

type SelectableDiet = {
    id: number;
    name: string;
    is_custom: boolean;
};

type EditProfileModalProps = {
    profile: Profile;
    onClose: () => void;
    onSaved: (profile: Profile) => void;
};

const ACTIVITY_LEVELS = ["Sedentary", "Light", "Moderate", "Very Active"];
const AVATARS: { id: AvatarId; picture: ProfilePicture; label: string }[] = [
    { id: "tomato", picture: "tomato", label: "Tomato" },
    { id: "blueberry", picture: "blueberry", label: "Blueberry" },
    { id: "watermelon", picture: "watermelon", label: "Watermelon" },
    { id: "grape", picture: "grape", label: "Grape" },
];

function formatHeight(totalInches: number): string {
    return `${Math.floor(totalInches / 12)}'${totalInches % 12}`;
}

function ageFromDate(dateOfBirth: string | null): string {
    if (!dateOfBirth) return "-";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        age -= 1;
    }
    return `${age} yrs`;
}

function ProfileField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="flex min-w-0 flex-col gap-1.5 text-base font-medium text-[#0A3323] sm:text-xs">
            <span>{label}</span>
            {children}
        </label>
    );
}

const inputClassName =
    "h-14 min-w-0 rounded-lg border border-[#E8DFC3] bg-[#F8F2DD] px-3 text-lg text-[#205C31] outline-none focus:border-[#26612F] focus:ring-2 focus:ring-[#26612F]/15 sm:h-10 sm:text-sm";

export default function EditProfileModal({
    profile,
    onClose,
    onSaved,
}: EditProfileModalProps) {
    const [firstName, setFirstName] = useState(profile.first_name ?? "");
    const [lastName, setLastName] = useState(profile.last_name ?? "");
    const [fullName, setFullName] = useState(`${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim());
    const [height, setHeight] = useState(profile.height === null ? "" : String(Math.round(Number(profile.height))));
    const [weight, setWeight] = useState(profile.weight === null ? "" : String(profile.weight));
    const [sex, setSex] = useState<Sex | "">(profile.sex ?? "");
    const [activityLevel, setActivityLevel] = useState(profile.activity_level ?? 1);
    const [avatar, setAvatar] = useState<AvatarId>(
        profile.profile_picture === "blueberry" || profile.profile_picture === "watermelon" || profile.profile_picture === "grape"
            ? profile.profile_picture
            : "tomato",
    );
    const [showAvatars, setShowAvatars] = useState(false);
    const [restrictions, setRestrictions] = useState<SelectableDiet[]>(profile.diet_restrictions);
    const [plans, setPlans] = useState<SelectableDiet[]>(profile.dietary_plans);
    const [restrictionCatalog, setRestrictionCatalog] = useState<SelectableDiet[]>([]);
    const [planCatalog, setPlanCatalog] = useState<SelectableDiet[]>([]);
    const [restrictionSearch, setRestrictionSearch] = useState("");
    const [planSearch, setPlanSearch] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !saving) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, saving]);

    useEffect(() => {
        Promise.all([getPresetDietRestrictions(), getPresetDietaryPlans()])
            .then(([restrictionItems, planItems]) => {
                setRestrictionCatalog(restrictionItems.map((item) => ({ ...item, is_custom: false })));
                setPlanCatalog(planItems.map((item) => ({ ...item, is_custom: false })));
            })
            .catch((loadError: unknown) => {
                console.error("Failed to load profile choices:", loadError);
            });
    }, []);

    function toggleSelection(
        item: SelectableDiet,
        selected: SelectableDiet[],
        setSelected: (next: SelectableDiet[]) => void,
    ) {
        const exists = selected.some((current) => current.name.toLowerCase() === item.name.toLowerCase());
        setSelected(
            exists
                ? selected.filter((current) => current.name.toLowerCase() !== item.name.toLowerCase())
                : [...selected, item],
        );
    }

    function searchChoices(
        query: string,
        catalog: SelectableDiet[],
        selected: SelectableDiet[],
    ) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return [];
        return catalog.filter(
            (item) =>
                item.name.toLowerCase().includes(trimmedQuery.toLowerCase()) &&
                !selected.some((current) => current.name.toLowerCase() === item.name.toLowerCase()),
        );
    }

    function addCustom(
        query: string,
        catalog: SelectableDiet[],
        selected: SelectableDiet[],
        setSelected: (next: SelectableDiet[]) => void,
        clearSearch: () => void,
    ) {
        const name = query.trim();
        if (!name || catalog.some((item) => item.name.toLowerCase() === name.toLowerCase()) || selected.some((item) => item.name.toLowerCase() === name.toLowerCase())) return;
        setSelected([...selected, { id: 0, name, is_custom: true }]);
        clearSearch();
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await updateProfile({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                height: Number(height),
                weight: Number(weight),
                sex: sex as Sex,
                activity_level: activityLevel,
                profile_picture: avatar,
            });
            await Promise.all([
                updateProfileDietRestrictions({
                    diet_restriction_ids: restrictions.filter((item) => !item.is_custom).map((item) => item.id),
                    custom_names: restrictions.filter((item) => item.is_custom).map((item) => item.name),
                }),
                updateProfileDietaryPlans({
                    dietary_plan_ids: plans.filter((item) => !item.is_custom).map((item) => item.id),
                    custom_names: plans.filter((item) => item.is_custom).map((item) => item.name),
                }),
            ]);
            onSaved(await getProfile());
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Unable to save your profile.");
            setSaving(false);
            return;
        }

        setSaving(false);
        onClose();
    }

    const restrictionSuggestions = searchChoices(restrictionSearch, restrictionCatalog, restrictions);
    const planSuggestions = searchChoices(planSearch, planCatalog, plans);
    const heightOptions = Array.from({ length: 120 }, (_, index) => index + 1);
    const canAddRestriction = restrictionSearch.trim().length > 0 &&
        !restrictionCatalog.some((item) => item.name.toLowerCase() === restrictionSearch.trim().toLowerCase()) &&
        !restrictions.some((item) => item.name.toLowerCase() === restrictionSearch.trim().toLowerCase());
    const canAddPlan = planSearch.trim().length > 0 &&
        !planCatalog.some((item) => item.name.toLowerCase() === planSearch.trim().toLowerCase()) &&
        !plans.some((item) => item.name.toLowerCase() === planSearch.trim().toLowerCase());

    function renderDietSection(
        title: string,
        selected: SelectableDiet[],
        setSelected: (next: SelectableDiet[]) => void,
        search: string,
        setSearch: (value: string) => void,
        catalog: SelectableDiet[],
        suggestions: SelectableDiet[],
        canAdd: boolean,
    ) {
        return (
            <section className="order-4 space-y-3 sm:order-0 sm:space-y-2">
                <h3 className="text-base font-medium text-[#0A3323] sm:text-xs">{title}</h3>
                <div className="flex min-h-11 flex-wrap gap-2 sm:min-h-7 sm:gap-1.5">
                    {selected.map((item) => (
                        <button
                            key={`${item.id}-${item.name}`}
                            type="button"
                            onClick={() => toggleSelection(item, selected, setSelected)}
                            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#26612F] px-5 text-base text-[#FFFDEE] sm:min-h-7 sm:px-3 sm:text-xs"
                            aria-label={`Remove ${item.name}`}
                        >
                            {item.name}<X size={13} aria-hidden="true" />
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={`Search ${title.toLowerCase()}`}
                        aria-label={`Search ${title.toLowerCase()}`}
                        className={`${inputClassName} h-14 w-full pr-9 text-base sm:h-9 sm:text-xs`}
                    />
                    {search ? (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label={`Clear ${title.toLowerCase()} search`}
                            className="absolute inset-y-0 right-2 flex w-7 items-center justify-center text-[#26612F]"
                        >
                            <X size={15} />
                        </button>
                    ) : null}
                </div>
                {search.trim() ? (
                    <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
                        {suggestions.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    toggleSelection(item, selected, setSelected);
                                    setSearch("");
                                }}
                                className="rounded-full border border-[#7FA27B] px-3 py-1 text-sm text-[#26612F] hover:bg-[#E7EFDF] sm:text-xs"
                            >
                                {item.name}
                            </button>
                        ))}
                        {canAdd ? (
                            <button
                                type="button"
                                onClick={() => addCustom(search, catalog, selected, setSelected, () => setSearch(""))}
                                className="rounded-full border border-dashed border-[#F16F33] bg-[#FFF1E6] px-3 py-1 text-sm text-[#B94F20] sm:text-xs"
                            >
                                Add: {search.trim()}
                            </button>
                        ) : null}
                        {suggestions.length === 0 && !canAdd ? (
                                <p className="text-sm text-[#638066] sm:text-xs">No matching options.</p>
                        ) : null}
                    </div>
                ) : null}
            </section>
        );
    }

    return (
        <div
            className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto bg-[#FFFDEE] p-0 sm:items-center sm:bg-[#0A3323]/35 sm:p-6 sm:backdrop-blur-[5px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !saving) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-profile-title"
                className="relative h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-[#FFFDEE] px-6 pb-10 pt-3 shadow-none sm:my-auto sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:max-w-155 sm:rounded-xl sm:border sm:border-[#91A889] sm:px-10 sm:pb-7 sm:pt-6 sm:shadow-[0_16px_60px_rgba(10,51,35,0.2)]"
            >
                <div className="relative mb-7 flex h-12 items-center justify-center sm:hidden">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Back to profile"
                        className="absolute left-0 flex h-10 w-10 items-center justify-center text-[#0A3323] disabled:opacity-50"
                    >
                        <ArrowLeft size={27} strokeWidth={2.5} />
                    </button>
                    <p aria-hidden="true" className="font-[Montserrat_Alternates] text-3xl font-semibold text-[#0A3323]">
                        Edit Profile
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    aria-label="Close edit profile"
                    className="absolute right-3 top-3 hidden h-9 w-9 items-center justify-center text-[#26612F] transition hover:text-[#F16F33] disabled:opacity-50 sm:flex sm:right-5 sm:top-4"
                >
                    <X size={25} strokeWidth={2.4} />
                </button>

                <header className="mb-8 flex flex-col items-center sm:mb-5">
                    <h2 id="edit-profile-title" className="sr-only">Edit profile</h2>
                    <Image
                        src={AVATAR_ASSETS[avatar]}
                        alt={`${avatar} avatar`}
                        width={80}
                        height={80}
                        className="h-40 w-40 rounded-full object-cover sm:h-20 sm:w-20"
                    />
                    <button
                        type="button"
                        onClick={() => setShowAvatars((current) => !current)}
                        aria-expanded={showAvatars}
                        className="mt-3 h-11 w-42 rounded-full bg-[#F16F33] px-5 text-lg font-medium text-white hover:bg-[#D95B25] sm:mt-2 sm:h-auto sm:w-auto sm:py-1 sm:text-xs"
                    >
                        Edit Avatar
                    </button>
                    {showAvatars ? (
                        <div className="mt-3 flex gap-3" aria-label="Choose avatar">
                            {AVATARS.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                        setAvatar(option.id);
                                        setShowAvatars(false);
                                    }}
                                    aria-label={option.label}
                                    aria-pressed={avatar === option.id}
                                    className={`rounded-full p-1 ${avatar === option.id ? "ring-2 ring-[#F16F33]" : "ring-1 ring-[#C8D4BE]"}`}
                                >
                                    <Image src={AVATAR_ASSETS[option.id]} alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
                                </button>
                            ))}
                        </div>
                    ) : null}
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-7 sm:gap-4">
                    <div className="order-1 hidden grid-cols-[minmax(0,1fr)_80px] gap-2 sm:order-0 sm:grid sm:gap-3">
                        <ProfileField label="First Name">
                            <input required maxLength={20} value={firstName} onChange={(event) => {
                                setFirstName(event.target.value);
                                setFullName(`${event.target.value} ${lastName}`.trim());
                            }} className={inputClassName} />
                        </ProfileField>
                        <ProfileField label="Age">
                            <input readOnly value={ageFromDate(profile.date_of_birth)} className={`${inputClassName} bg-[#F2ECD5]`} />
                        </ProfileField>
                        <ProfileField label="Last Name">
                            <input required maxLength={20} value={lastName} onChange={(event) => {
                                setLastName(event.target.value);
                                setFullName(`${firstName} ${event.target.value}`.trim());
                            }} className={inputClassName} />
                        </ProfileField>
                        <span aria-hidden="true" />
                    </div>

                    <div className="order-1 flex flex-col gap-5 sm:hidden">
                        <ProfileField label="First and Last Name">
                            <input
                                required
                                maxLength={41}
                                pattern=".*\S\s+\S.*"
                                value={fullName}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    const trimmedValue = value.trimEnd();
                                    const separator = trimmedValue.lastIndexOf(" ");
                                    setFullName(value);
                                    setFirstName(separator < 0 ? trimmedValue : trimmedValue.slice(0, separator).trim());
                                    setLastName(separator < 0 ? "" : trimmedValue.slice(separator + 1));
                                }}
                                className={inputClassName}
                            />
                        </ProfileField>
                        <div className="w-28">
                            <ProfileField label="Age">
                                <input readOnly value={ageFromDate(profile.date_of_birth)} className={`${inputClassName} bg-[#F2ECD5]`} />
                            </ProfileField>
                        </div>
                    </div>

                    <div className="order-3 grid grid-cols-3 gap-2 sm:order-0 sm:gap-3">
                        <ProfileField label="Height (in)">
                            <select required aria-label="Height in feet and inches" value={height} onChange={(event) => setHeight(event.target.value)} className={`${inputClassName} px-2`}>
                                <option value="" disabled>Select</option>
                                {heightOptions.map((totalInches) => (
                                    <option key={totalInches} value={totalInches}>{formatHeight(totalInches)}</option>
                                ))}
                            </select>
                        </ProfileField>
                        <ProfileField label="Weight (lb)">
                            <input required type="number" min="1" max="999" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} className={inputClassName} />
                        </ProfileField>
                        <ProfileField label="Sex">
                            <select required value={sex} onChange={(event) => setSex(event.target.value as Sex)} className={inputClassName}>
                                <option value="" disabled>Select</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other">Other</option>
                            </select>
                        </ProfileField>
                    </div>

                    <fieldset className="order-2 sm:order-0">
                        <legend className="mb-3 text-lg font-medium leading-tight text-[#0A3323] sm:mb-2 sm:text-xs">How physically active would you describe yourself as?</legend>
                        <div className="grid grid-cols-4 gap-1">
                            {ACTIVITY_LEVELS.map((level, index) => (
                                <label key={level} className="flex cursor-pointer flex-col items-center gap-2 text-center text-sm text-[#26612F] sm:gap-1.5 sm:text-xs">
                                    <input
                                        type="radio"
                                        name="activity-level"
                                        value={index + 1}
                                        checked={activityLevel === index + 1}
                                        onChange={() => setActivityLevel(index + 1)}
                                        className="h-4 w-4 accent-[#F16F33]"
                                    />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {renderDietSection("Your Restrictions", restrictions, setRestrictions, restrictionSearch, setRestrictionSearch, restrictionCatalog, restrictionSuggestions, canAddRestriction)}
                    {renderDietSection("Your Dietary Plans", plans, setPlans, planSearch, setPlanSearch, planCatalog, planSuggestions, canAddPlan)}

                    {error ? <p role="alert" className="order-5 wrap-break-word text-sm text-red-700 sm:order-0">{error}</p> : null}

                    <footer className="order-6 flex justify-end gap-2 border-t border-[#E8DFC3] pt-4 sm:order-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="h-10 rounded-lg border border-[#7FA27B] px-4 text-sm font-medium text-[#26612F] hover:bg-[#E7EFDF] disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="h-10 rounded-lg bg-[#F16F33] px-5 text-sm font-semibold text-white hover:bg-[#D95B25] disabled:cursor-wait disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}