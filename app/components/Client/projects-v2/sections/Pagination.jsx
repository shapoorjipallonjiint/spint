"use client";

// Prev / "01 / 14" / Next pager for the projects listing.
// disabled: blocks both buttons (e.g. while the list fades between pages).
const Pagination = ({ currentPage, totalPages, onPrev, onNext, disabled = false, isArabic = false }) => {
    const prevDisabled = currentPage === 1 || disabled;
    const nextDisabled = currentPage === totalPages || disabled;

    return (
        <div className="flex items-center justify-center gap-2 w-full pb-80px">
            <div className="pagination flex items-center gap-5 justify-center ">
                <button
                    type="button"
                    aria-label="Previous page"
                    className={`prev cursor-pointer transition-all duration-200 hover:scale-110 ${isArabic ? "rotate-180" : ""} disabled:opacity-30 disabled:cursor-not-allowed ${prevDisabled ? "opacity-30" : "opacity-100"}`}
                    onClick={onPrev}
                    disabled={prevDisabled}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.7549 1.25L1.25 9.7549M1.25 9.7549L9.75297 18.2579M1.25 9.7549L18.2169 9.79374"
                            stroke="#30B6F9"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <p>
                    <span className="current-page font-bold text-16 leading-[2.4375]">{String(currentPage).padStart(2, "0")}</span>
                    {" / "}
                    <span className="total-pages">{String(totalPages).padStart(2, "0")}</span>
                </p>

                <button
                    type="button"
                    aria-label="Next page"
                    className={`next cursor-pointer transition-all duration-200 hover:scale-110 ${isArabic ? "rotate-180" : ""} disabled:opacity-30 disabled:cursor-not-allowed ${nextDisabled ? "opacity-30" : "opacity-100"}`}
                    onClick={onNext}
                    disabled={nextDisabled}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.71189 1.25L18.2168 9.7549M18.2168 9.7549L9.71383 18.2579M18.2168 9.7549L1.24994 9.79374"
                            stroke="#30B6F9"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
