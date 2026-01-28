"use client";

import { useState } from "react";
import Select from "react-select";
// import { contactData } from "../data";
import H2Title from "../../../common/H2Title";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import SplitTextAnimation from "../../../../components/common/SplitTextAnimation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const ContactDetails = ({ data }) => {
    const isArabic = useIsPreferredLanguageArabic();
    const t = useApplyLang(data);
    const [subject, setSubject] = useState(null);
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const handleCaptchaChange = (value) => {
        if (value) {
            setCaptchaVerified(true);
        } else {
            setCaptchaVerified(false);
        }
    };

    const options = [
        { value: "general", label: isArabic ? "الإستفسار العام" : "General Inquiry" },
        { value: "partnership", label: isArabic ? "شراكة" : "Partnership" },
        { value: "support", label: isArabic ? "الدعم" : "Support" },
        { value: "other", label: isArabic ? "آخر" : "Other" },
    ];

    const FormLabels = {
        name: "Name*",
        name_ar: "الاسم*",
        email: "Email*",
        email_ar: "البريد الالكتروني*",
        phone: "Phone*",
        phone_ar: "رقم الهاتف*",
        organization: "Your Organization*",
        organization_ar: "المنظمة*",
        country: "Country*",
        country_ar: "البلد*",
        subject: "Subject*",
        subject_ar: "الموضوع*",
        message: "Message*",
        message_ar: "الرسالة*",
        verifyCaptcha: "Verify Captcha",
        verifyCaptcha_ar: "تحقق من التحقق",
        sendMessage: "Send Message",
        sendMessage_ar: "إرسال رسالة",
    }
    const tFormLabels = useApplyLang(FormLabels);

    const customStyles = {
        control: (base, state) => ({
            ...base,
            background: "transparent",
            border: "none",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 0,
            padding: "4px 0",
            boxShadow: "none",
            color: "white",
            cursor: "pointer",
        }),
        singleValue: (base) => ({ ...base, color: "white" }),
        placeholder: (base) => ({ ...base, color: "transparent" }), // hide placeholder
        indicatorSeparator: () => ({ display: "none" }),
        menu: (base) => ({
            ...base,
            background: "#0E1A2A",
            color: "white",
        }),
        option: (base, state) => ({
            ...base,
            background: state.isFocused ? "#1A2D47" : "transparent",
            color: "white",
            cursor: "pointer",
            paddingLeft: "10px",
            fontSize: "14px",
        }),
    };
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
    });

    const onSubmit = async (formData) => {
        if (!captchaVerified) {
            alert("Please verify that you are not a robot.");
            return;
        }

        if (!subject?.value) {
            alert("Please select a subject.");
            return;
        }

        try {
            const payload = {
                ...formData,
                subject: subject.value,
            };

            const response = await fetch("/api/admin/contact/enquiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const res = await response.json();

            if (res.success) {
                alert(res.message);
                reset();
                setSubject(null);
                setCaptchaVerified(false);
            } else {
                alert(res.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Sorry, something went wrong. Please try again later.");
        }
    };

    return (
        <section className="pt-text30 bg-f5f5 pb-10 lg:pb-0">
            <div className="container">
                <h1 className="text-45 2xl:text-70 font-light leading-[1.071428571428571] pb-7 xl:pb-15 2xl:pb-22 3xl:pb-31">
                    <SplitTextAnimation children={t.pageTitle} staggerDelay={0.2} animationDuration={0.8} delay={0.2} />
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-[0.6fr_1fr] xl:grid-cols-[1fr_1fr] 2xl:grid-cols-[auto_650px] 3xl:grid-cols-[auto_866px] gap-y-8 lg:gap-x-8 3xl:gap-[131px]">
                    <div className="lg:pt-[56px]">
                        <motion.h3
                            variants={moveUp(0.4)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="text-19 font-light text-paragraph mb-3 lg:mb-6 "
                        >
                            {isArabic ? "المقر الرئيسي" : "Head office"}
                        </motion.h3>
                        <motion.p
                            variants={moveUp(0.4)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="text-29 font-bold leading-[1.31] "
                        >
                            {t?.firstSection.name}
                        </motion.p>
                        <motion.p
                            variants={moveUp(0.6)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="text-paragraph text-20 xl:text-26 3xl:text-29 font-light leading-[1.35] max-w-[25ch]"
                        >
                            {t?.firstSection.address}
                        </motion.p>
                        <div className="flex flex-col 2xl:flex-row   gap-5  2xl:gap-15 my-6 lg:my-10 xl:my-15 2xl:my-20 3xl:justify-between">
                            <div>
                                <motion.p
                                    variants={moveUp(0.7)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="text-paragraph text-19 font-light mb-1 lg:mb-[10px] leading-[1.48] "
                                >
                                    {isArabic ? "هاتف" : "Phone"}
                                </motion.p>
                                <motion.p
                                    variants={moveUp(0.8)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="text-black text-20 xl:text-26 3xl:text-29 font-light leading-[1.31] "
                                >
                                    {t?.firstSection.phone}
                                </motion.p>
                            </div>
                            <div>
                                <motion.p
                                    variants={moveUp(0.7)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="text-paragraph text-19 font-light mb-1 lg:mb-[10px] leading-[1.48] "
                                >
                                    {isArabic ? "البريد الإلكتروني" : "Email"}
                                </motion.p>
                                <motion.p
                                    variants={moveUp(0.8)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="text-black text-20 xl:text-26 3xl:text-29 leading-[1.31]   font-light"
                                >
                                    {t?.firstSection.email}
                                </motion.p>
                            </div>
                        </div>

                        <div className="w-fit">
                            <Link href={t.firstSection.location} target="blank">
                                <div className="flex gap-[6px] items-center cursor-pointer">
                                    <p className="text-16 font-light uppercase text-paragraph">{isArabic ? "الموقع" : "Location"}</p>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="19"
                                        viewBox="0 0 15 19"
                                        fill="none"
                                    >
                                        <g clipPath="url(#clip0_3796_2437)">
                                            <path
                                                d="M7.49886 1.06396C3.95699 1.06396 1.08594 3.91705 1.08594 7.43674C1.08594 8.72329 1.47165 9.91985 2.12904 10.9198L7.43513 17.7258L12.8653 10.9198C13.5261 9.91652 13.9084 8.71996 13.9084 7.43674C13.9151 3.91705 11.0407 1.06396 7.49886 1.06396Z"
                                                stroke="#30B6F9"
                                                strokeWidth="2"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M7.5 10C8.88071 10 10 8.88071 10 7.5C10 6.11929 8.88071 5 7.5 5C6.11929 5 5 6.11929 5 7.5C5 8.88071 6.11929 10 7.5 10Z"
                                                stroke="#30B6F9"
                                                strokeWidth="2"
                                                strokeMiterlimit="10"
                                                strokeLinecap="round"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_3796_2437">
                                                <rect width="15" height="19" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="bg-primary px-5 pt-8 pb-9 lg:p-8 xl:p-10 3xl:p-[70px] 3xl:pt-[59px]">
                        <H2Title titleText={isArabic ? "الإستفسارات العامة" : "General Inquiry"} titleColor="white" marginClass="mb-4 3xl:mb-50px" />
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid sm:grid-cols-2 gap-5 2xl:gap-50px w-full mb-6 xl:mb-8 3xl:mb-[30px]">
                                <motion.div
                                    variants={moveUp(0.4)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="relative w-full "
                                >
                                    <input
                                        id="name"
                                        {...register("name", { required: "Name is required" })}
                                        type="text"
                                        className="peer w-full bg-transparent text-19 font-extralight border-0 border-b border-white/30 py-5 focus:border-white text-white focus:outline-none placeholder-transparent"
                                        placeholder=" "
                                    />

                                    <p className="text-red-400 text-14 min-h-[14px] mt-2">{errors.name?.message}</p>

                                    <label
                                        htmlFor="name"
                                        className={`absolute ${isArabic ? "right-0" : "left-0"} top-1/2 -translate-y-1/2  text-white text-19 font-extralight transition-all duration-200 ease-out peer-focus:top-0 peer-focus:text-xs peer-focus:text-white peer-focus:-translate-y-full peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base 2xl:peer-placeholder-shown:text-19 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-full peer-not-placeholder-shown:text-19 peer-not-placeholder-shown:text-white`}
                                    >
                                        {tFormLabels.name}
                                    </label>
                                </motion.div>

                                <motion.div
                                    variants={moveUp(0.5)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="relative w-full "
                                >
                                    <input
                                        id="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+\.\S+$/,
                                                message: "Enter a valid email",
                                            },
                                        })}
                                        type="email"
                                        className="peer w-full bg-transparent text-19 font-extralight border-0 border-b border-white/30 py-5 focus:border-white text-white focus:outline-none placeholder-transparent"
                                        placeholder=" "
                                    />

                                    <p className="text-red-400 text-14 min-h-[14px] mt-2">{errors.email?.message}</p>

                                    <label
                                        htmlFor="email"
                                        className={`absolute ${isArabic ? "right-0" : "left-0"} top-1/2 -translate-y-1/2  text-white text-19 font-extralight transition-all duration-200 ease-out peer-focus:top-0 peer-focus:text-xs peer-focus:text-white peer-focus:-translate-y-full peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base 2xl:peer-placeholder-shown:text-19 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-full peer-not-placeholder-shown:text-19 peer-not-placeholder-shown:text-white`}
                                    >
                                        {tFormLabels.email}
                                    </label>
                                </motion.div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5 2xl:gap-12 w-full mb-6 xl:mb-8 3xl:mb-[30px]">
                                <motion.div
                                    variants={moveUp(0.7)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="relative w-full"
                                >
                                    <input
                                        id="organization"
                                        {...register("organization", { required: "Organization is required" })}
                                        type="text"
                                        className="peer w-full bg-transparent text-19 font-extralight border-0 border-b border-white/30 py-5 focus:border-white text-white focus:outline-none placeholder-transparent"
                                        placeholder=" "
                                    />

                                    <p className="text-red-400 text-14 min-h-3.5 mt-2">{errors.organization?.message}</p>

                                    <label
                                        htmlFor="organization"
                                        className={`absolute ${isArabic ? "right-0" : "left-0"} top-1/2 -translate-y-1/2  text-white text-19 font-extralight transition-all duration-200 ease-out peer-focus:top-0 peer-focus:text-xs peer-focus:text-white peer-focus:-translate-y-full peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base 2xl:peer-placeholder-shown:text-19 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-full peer-not-placeholder-shown:text-19 peer-not-placeholder-shown:text-white`}
                                    >
                                        {tFormLabels.organization}
                                    </label>
                                </motion.div>

                                <motion.div
                                    variants={moveUp(0.8)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="relative w-full"
                                >
                                    <input
                                        id="country"
                                        {...register("country", { required: "Country is required" })}
                                        type="text"
                                        className="peer w-full bg-transparent text-19 font-extralight border-0 border-b border-white/30 py-5 focus:border-white text-white focus:outline-none placeholder-transparent"
                                        placeholder=" "
                                    />

                                    <p className="text-red-400 text-14 min-h-3.5 mt-2">{errors.country?.message}</p>

                                    <label
                                        htmlFor="country"
                                        className={`absolute ${isArabic ? "right-0" : "left-0"} top-1/2 -translate-y-1/2  text-white text-19 font-extralight transition-all duration-200 ease-out peer-focus:top-0 peer-focus:text-xs peer-focus:text-white peer-focus:-translate-y-full peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base 2xl:peer-placeholder-shown:text-19 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-full peer-not-placeholder-shown:text-19 peer-not-placeholder-shown:text-white`}
                                    >
                                        {tFormLabels.country}
                                    </label>
                                </motion.div>
                            </div>
                            <motion.div
                                variants={moveUp(0.9)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                                className="relative mb-6 xl:mb-8 3xl:mb-[30px]"
                            >
                                {/* Floating Label */}
                                <label
                                    className={`absolute ${isArabic ? "right-0" : "left-0"} transition-all duration-200 text-white text-base 2xl:text-19 font-extralight pointer-events-none ${subject ? "top-2 -translate-y-full text-xs text-white" : "top-1/2 -translate-y-1/2 "
                                        }`}
                                >
                                    {tFormLabels.subject}
                                </label>

                                {/* Make this container act like peer */}
                                <div className={`pt-3 peer ${subject ? "text-white" : "text-white/60"}`}>
                                    <Select
                                        options={options}
                                        value={subject}
                                        onChange={setSubject}
                                        styles={customStyles}
                                        placeholder=""
                                        classNamePrefix="react-select font-light text-19 !px-0"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                variants={moveUp(1)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                                className="relative mb-20px"
                            >
                                <textarea
                                    id="message"
                                    rows="3"
                                    {...register("message", {
                                        required: "Message is required",
                                        minLength: {
                                            value: 10,
                                            message: "Message must be at least 10 characters",
                                        },
                                    })}
                                    className="peer w-full bg-transparent text-base 2xl:text-19 font-extralight border-0 border-b border-white/30 h-[95px] focus:border-white text-white focus:outline-none placeholder-transparent resize-none"
                                    placeholder=" "
                                />

                                <p className="text-red-400 text-14 min-h-3.5 mt-2">{errors.message?.message}</p>

                                <label
                                    htmlFor="message"
                                    className={`absolute ${isArabic ? "right-0" : "left-0"} top-1/2 -translate-y-1/2  text-white text-base 2xl:text-19 font-extralight
                            transition-all duration-200 ease-out
                            peer-focus:top-0 peer-focus:text-xs peer-focus:text-white peer-focus:-translate-y-full
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base 2xl:peer-placeholder-shown:text-19
                            peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-full peer-not-placeholder-shown:text-19 peer-not-placeholder-shown:text-white`}
                                >
                                    {tFormLabels.message}
                                </label>
                            </motion.div>

                            <div className="mb-6">
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                    onChange={handleCaptchaChange}
                                    theme="dark"
                                />
                            </div>

                            <motion.button
                                variants={moveUp(1)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                                type="submit"
                                disabled={!captchaVerified}
                                className={`bg-white/25 text-white rounded-full uppercase transition-opacity
        ${!captchaVerified ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}
    `}
                            >
                                <div className="relative p-[1px] rounded-full">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#30B6F9] to-[#1E45A2]"></div>

                                    <div
                                        className={`relative rounded-full bg-[#5974b7] py-2 px-4 text-white
                text-[12px] md:text-[14px] lg:text-[16px]
                ${!captchaVerified ? "pointer-events-none" : "cursor-pointer"}
            `}
                                    >
                                        {/* Send Message */}
                                        {!captchaVerified ? tFormLabels.verifyCaptcha : tFormLabels.sendMessage}
                                    </div>
                                </div>
                            </motion.button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactDetails;
