/* Height/Weight card -- Displays the height/weight information on the profile page

The props are defined as follows
    title: either "Height" or "Weight"
    imperial: the specific value for that respective field in imperial units (e.g., 5' 11" or 165.4 for height & weight respectively)

As both these fields have consistent styling, their display has been generalized under the same type of card with cusotmizable props to account for the difference
*/
type DietaryRestrictionPlanCardProps = {
    title: "Height" | "Weight";
    imperial: string | number;
    metric: string | number;
};

export default function DietaryRestrictionPlanCard({
    title,
    imperial,
    metric,
}: DietaryRestrictionPlanCardProps) {
    return (
        <div
            className="
                flex
                w-full
                max-w-[334px]
                aspect-[334/196]
                flex-col
                justify-center
                items-center
                shrink-0
                rounded-[20px]
                border
                border-[#0A3323]
                bg-[#FFFDEE]
                shadow-[0_4px_4px_0_#0A3323]
                box-border
            "
        >
            {/* Icon + text */}
            <div className="flex w-[88%] h-[61%] items-center justify-center gap-[7%]">

                {/* Icon box */}
                <div
                    className="
                        flex
                        aspect-square
                        h-full
                        shrink-0
                        items-start
                        justify-center
                        rounded-[20px]
                        bg-[#C2D8B2]
                        p-[9%]
                        box-border
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 99 95"
                        fill="none"
                        className="w-full h-full"
                    >
                        <path
                            d="M50.5058 15.833C50.5058 15.0456 50.8187 14.2905 51.3757 13.7338C51.9327 13.177 52.6881 12.8643 53.4758 12.8643H81.18C81.9677 12.8643 82.7231 13.177 83.2801 13.7338C83.8371 14.2905 84.15 15.0456 84.15 15.833C84.15 16.6204 83.8371 17.3755 83.2801 17.9322C82.7231 18.489 81.9677 18.8018 81.18 18.8018H53.4758C52.6881 18.8018 51.9327 18.489 51.3757 17.9322C50.8187 17.3755 50.5058 16.6204 50.5058 15.833ZM81.18 55.0878H53.4758C52.6881 55.0878 51.9327 55.4006 51.3757 55.9573C50.8187 56.5141 50.5058 57.2692 50.5058 58.0566C50.5058 58.8439 50.8187 59.599 51.3757 60.1558C51.9327 60.7125 52.6881 61.0253 53.4758 61.0253H81.18C81.9677 61.0253 82.7231 60.7125 83.2801 60.1558C83.8371 59.599 84.15 58.8439 84.15 58.0566C84.15 57.2692 83.8371 56.5141 83.2801 55.9573C82.7231 55.4006 81.9677 55.0878 81.18 55.0878ZM53.4758 76.1976C52.6881 76.1976 51.9327 76.5104 51.3757 77.0671C50.8187 77.6239 50.5058 78.379 50.5058 79.1664C50.5058 79.9537 50.8187 80.7088 51.3757 81.2656C51.9327 81.8223 52.6881 82.1351 53.4758 82.1351H81.18C81.9677 82.1351 82.7231 81.8223 83.2801 81.2656C83.8371 80.7088 84.15 79.9537 84.15 79.1664C84.15 78.379 83.8371 77.6239 83.2801 77.0671C82.7231 76.5104 81.9677 76.1976 81.18 76.1976ZM81.18 39.9116H53.4758C52.6881 39.9116 51.9327 39.5988 51.3757 39.042C50.8187 38.4853 50.5058 37.7302 50.5058 36.9428C50.5058 36.1554 50.8187 35.4003 51.3757 34.8436C51.9327 34.2868 52.6881 33.9741 53.4758 33.9741H81.18C81.9677 33.9741 82.7231 34.2868 83.2801 34.8436C83.8371 35.4003 84.15 36.1554 84.15 36.9428C84.15 37.7302 83.8371 38.4853 83.2801 39.042C82.7231 39.5988 81.9677 39.9116 81.18 39.9116ZM39.497 65.1934L32.6779 72.0018V22.9976L39.497 29.8059C40.06 30.3303 40.8047 30.6158 41.5741 30.6022C42.3436 30.5887 43.0777 30.2771 43.6219 29.7332C44.166 29.1893 44.4777 28.4554 44.4913 27.6863C44.5049 26.9172 44.2193 26.1729 43.6946 25.6101L31.8067 13.7351C31.2498 13.1791 30.495 12.8669 29.7079 12.8669C28.9209 12.8669 28.166 13.1791 27.6091 13.7351L15.7212 25.6101C15.1966 26.1729 14.911 26.9172 14.9245 27.6863C14.9381 28.4554 15.2498 29.1893 15.794 29.7332C16.3381 30.2771 17.0722 30.5887 17.8417 30.6022C18.6111 30.6158 19.3558 30.3303 19.9188 29.8059L26.7379 22.9976V72.0018L19.9188 65.1934C19.3558 64.669 18.6111 64.3835 17.8417 64.3971C17.0722 64.4107 16.3381 64.7223 15.794 65.2662C15.2498 65.8101 14.9381 66.5439 14.9245 67.313C14.911 68.0821 15.1966 68.8265 15.7212 69.3893L27.6091 81.2643C28.166 81.8202 28.9209 82.1325 29.7079 82.1325C30.495 82.1325 31.2498 81.8202 31.8067 81.2643L43.6946 69.3893C44.2193 68.8265 44.5049 68.0821 44.4913 67.313C44.4777 66.5439 44.166 65.8101 43.6219 65.2662C43.0777 64.7223 42.3436 64.4107 41.5741 64.3971C40.8047 64.3835 40.06 64.669 39.497 65.1934Z"
                            fill="#0A3323"
                        />
                    </svg>
                </div>

                {/* Text */}
                <div className="flex min-w-0 flex-col justify-center">
                    <span className="font-['Instrument_Sans'] text-[clamp(1rem,2.1vw,1.875rem)] font-medium leading-normal text-[#346B3B]">
                        {title}
                    </span>

                    <span className="font-['Instrument_Sans'] text-[clamp(1.5rem,2.8vw,2.5rem)] font-semibold leading-normal text-[#346B3B]">
                        {imperial}
                    </span>

                    <span className="font-['Instrument_Sans'] text-[clamp(1rem,2.1vw,1.875rem)] font-medium leading-normal text-[#346B3B]">
                        {metric}
                    </span>
                </div>
            </div>
        </div>
    );
}