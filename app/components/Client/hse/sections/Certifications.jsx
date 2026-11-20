"use client";

import H2Title from "@/app/components/common/H2Title";
import { moveUp } from "@/app/components/motionVarients";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import "swiper/css";
import PdfOpenList, { canShowPdfInline } from "@/app/components/common/PdfOpenList";
import { assets } from "@/app/assets";

const Certifications = ({ data }) => {
  const isArabic = useIsPreferredLanguageArabic();
  const MotionImage = motion.create(Image);
  const [activeImage, setActiveImage] = useState(null);
  const t = useApplyLang(data);
  // const items = [
  //   {
  //     fileName: "ISO 45001:2018",
  //     imageAlt: "Occupational Health and Safety Management Systems",
  //     description: "Occupational Health and Safety Management Systems ",

  //     // The main thumbnail/file image used in the grid/mobile view
  //     fileImage: "/assets/pdf/ohsm/ohsmbanner.jpg",
  //     fileImageAlt: "Occupational Health and Safety Management Systems",
  //     // The actual PDF path for the popup iframe
  //     pdfUrl: [
  //       {
  //         name: "Abu Dhabi",
  //         url: "/assets/pdf/ohsm/45001-2018-occupational-abudhabi.pdf",
  //       },
  //       {
  //         name: "Dubai",
  //         url: "/assets/pdf/ohsm/45001-2018-occupational-dubai.pdf",
  //       },
  //       {
  //         name: "Oman",
  //         url: "/assets/pdf/ohsm/45001-2018-occupational-oman.pdf",
  //       },
  //       {
  //         name: "Gambia",
  //         url: "/assets/pdf/ohsm/45001-2018-occupational-gambia.pdf",
  //       },
  //       {
  //         name: "Ghana",
  //         url: "/assets/pdf/ohsm/45001-2018-occupational-ghana.pdf",
  //       },
  //       {
  //         name: "Nigeria",
  //         url: "/assets/pdf/ohsm/45001-2018-occupational-nigeria.pdf",
  //       },
  //       {
  //         name: "KSA",
  //         url: "/assets/pdf/ohsm/45001-2018-occupational-ksa.pdf",
  //       },
  //     ]

  //   },
  //   {
  //     fileName: "ISO 14001:2015",
  //     imageAlt: "Environmental Management System",
  //     description: "Environmental Management System",

  //     fileImage: "/assets/pdf/ems/ems.jpg",
  //     fileImageAlt: "Environmental Management System",
  //     pdfUrl: [
  //       {
  //         name: "Abu Dhabi",
  //         url: "/assets/pdf/ems/14001-2015-ems-abudhabi.pdf",
  //       },
  //       {
  //         name: "Dubai",
  //         url: "/assets/pdf/ems/14001-2015-ems-dubai.pdf",
  //       },
  //       {
  //         name: "Gambia",
  //         url: "/assets/pdf/ems/14001-2015-ems-gambia.pdf",
  //       },
  //       {
  //         name: "Ghana",
  //         url: "/assets/pdf/ems/14001-2015-ems-ghana.pdf",
  //       },
  //       {
  //         name: "KSA",
  //         url: "/assets/pdf/ems/14001-2015-ems-ksa.pdf",
  //       },
  //       {
  //         name: "Nigeria",
  //         url: "/assets/pdf/ems/14001-2015-ems-nigeria.pdf",
  //       },
  //       {
  //         name: "Oman",
  //         url: "/assets/pdf/ems/14001-2015-ems-oman.pdf",
  //       },
  //     ]
  //   },
  //   {
  //     fileName: "ISO 9001 2015",
  //     imageAlt: "Quality Management System",
  //     description: "Quality Management System",

  //     fileImage: "/assets/pdf/qms/qms.jpg",
  //     fileImageAlt: "Quality Management System",
  //     pdfUrl: [
  //       {
  //         name: "Abu Dhabi",
  //         url: "/assets/pdf/qms/9001-2015-qms-abudhabi.pdf",
  //       },
  //       {
  //         name: "Dubai",
  //         url: "/assets/pdf/qms/9001-2015-qms-dubai.pdf",
  //       },
  //       {
  //         name: "Ghana",
  //         url: "/assets/pdf/qms/9001-2015-qms-ghana.pdf",
  //       },
  //       {
  //         name: "Gambia",
  //         url: "/assets/pdf/qms/9001-2015-qms-gmbia.pdf",
  //       },
  //       {
  //         name: "KSA",
  //         url: "/assets/pdf/qms/9001-2015-qms-ksa.pdf",
  //       },
  //       {
  //         name: "Nigeria",
  //         url: "/assets/pdf/qms/9001-2015-qms-nigeria.pdf",
  //       },
  //       {
  //         name: "Oman",
  //         url: "/assets/pdf/qms/9001-2015-qms-oman.pdf",
  //       },
  //     ]
  //   }
  // ];
  const [imageSwiper, setImageSwiper] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  // locked = all cards fit in view (Swiper disables sliding), so the arrows are hidden
  const [navState, setNavState] = useState({ locked: false });
  const updateNavState = (swiper) => setNavState({ locked: !!swiper.isLocked });
  const [isPdfLoading, setIsPdfLoading] = useState(true);


  // State for PDF Popup
  const [itemIndex, setItemIndex] = useState(null); // Tracks which card is open
  const [pdfIndex, setPdfIndex] = useState(0); // Tracks which PDF in the array is active

  // Close Modal Handler
  const closeModal = () => {
    setItemIndex(null);
    setPdfIndex(0);
  };

  // documents of a card (entries without an uploaded file are ignored). A card with none opens its image instead.
  const filesOf = (item) => (Array.isArray(item?.files) ? item.files.filter((f) => f?.file) : []);
  const openItem = itemIndex !== null ? t.items[itemIndex] : null;
  const openFiles = filesOf(openItem);
  const isImageOnly = !!openItem && openFiles.length === 0;

  // PDF Navigation Logic
  const nextPdf = () => {
    if (openFiles.length < 2) return;
    setPdfIndex((prev) => (prev + 1) % openFiles.length);
  };

  const prevPdf = () => {
    if (openFiles.length < 2) return;
    setPdfIndex((prev) => (prev - 1 + openFiles.length) % openFiles.length);
  };

  useEffect(() => {
    if (itemIndex !== null) {
      setIsPdfLoading(true);
    }
  }, [itemIndex, pdfIndex]);

  // Keep the page behind the popup from scrolling
  useLockBodyScroll(itemIndex !== null);

  // Handle Keyboard Escape and Arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (itemIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextPdf();
      if (e.key === 'ArrowLeft') prevPdf();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [itemIndex]);
  return (
    <section className="section-spacing bg-primary">
      <div className="container ">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-10">
          <div>
            <H2Title titleText={t.title} titleColor="white" marginClass="mb-4 2xl:mb-50px" />
            <motion.p
              variants={moveUp(0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.2, once: true }}
              className="text-19 font-light leading-[1.474] max-w-[85ch] text-white"
            >
              {t.description}
            </motion.p>
          </div>

          {/* arrows + counter (hidden when every card already fits in view) */}
          {!navState.locked && (
            <motion.div
              variants={moveUp(0.6)}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.2, once: true }}
              className="flex items-center gap-4 shrink-0"
            >
              <button
                type="button"
                onClick={() => imageSwiper?.slidePrev()}
                className={`group ${isArabic ? "hover:translate-x-1 rotate-180" : "hover:-translate-x-1"} transition-all duration-300 cursor-pointer w-10 h-10 xl:w-[50px] xl:h-[50px] rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center`}
                aria-label="Previous slide"
              >
                <Image src={assets.arrowLeft2} alt="" width={14} height={14} className="w-[16px] h-[16px]" />
              </button>
              <button
                type="button"
                onClick={() => imageSwiper?.slideNext()}
                className={`group ${isArabic ? "hover:-translate-x-1 -rotate-180" : "hover:translate-x-1"} transition-all duration-300 cursor-pointer w-10 h-10 xl:w-[50px] xl:h-[50px] rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center`}
                aria-label="Next slide"
              >
                <Image src={assets.arrowRight2} alt="" width={14} height={14} className="w-[16px] h-[16px]" />
              </button>
              <span className="text-19 leading-[1.473684210526316] text-white ms-2 tabular-nums">
                {String(currentSlide + 1).padStart(2, "0")}/{String(t.items.length).padStart(2, "0")}
              </span>
            </motion.div>
          )}
        </div>

        <div className="relative">
          {/* one slider for every screen: 1.4 cards per view on phones (next card peeks in), 2 from md, 3 from lg. Cards keep the old grid look
              (thin white divider on the start side of each card, closing divider at the end of the track) */}
          <div className="mt-5 xl:mt-50px border-t border-white/20">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={0}
              slidesPerView={1.4}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              rewind={true}
              speed={700}
              autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              onSwiper={(swiper) => {
                setImageSwiper(swiper);
                updateNavState(swiper);
              }}
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
              onResize={updateNavState}
              onBreakpoint={updateNavState}
              className="hse-recognitions-swiper md:border-e border-white/20"
            >
              {t.items.map((item, index) => (
                <SwiperSlide key={index} className="!h-auto">
                  <div className="h-full p-3 pt-6 md:p-6 lg:p-10 lg:pb-5 border-s border-white/20">
                    <button
                      type="button"
                      className="block cursor-pointer overflow-hidden"
                      onClick={() => {
                        setItemIndex(index);
                        setPdfIndex(0);
                      }}
                      aria-label={item.title}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        width={276}
                        height={400}
                        src={item.thumbnail}
                        alt={item.thumbnailAlt}
                        className="w-auto max-w-full h-[130px] sm:h-[170px] lg:h-[200px] 3xl:h-[226px] object-contain transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </button>
                    <h3 className="text-20 lg:text-29 mt-5 lg:mt-7 text-white font-light leading-[1.312]">
                      {item.title}
                    </h3>
                    {item.subTitle && (
                      <p className="text-16 lg:text-19 mt-2 lg:mt-4 text-white/70 font-light leading-[1.35]">{item.subTitle}</p>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* --- PDF POPUP MODAL --- */}
          <AnimatePresence>
            {itemIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                onClick={closeModal} // Click outside to close
              >
                {isImageOnly ? (
                  /* image-only card: show its image large */
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative flex flex-col items-center max-w-6xl w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-full flex justify-between items-center gap-4 pb-3 text-white">
                      <h3 className="font-medium">{openItem.title}</h3>
                      <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close"
                        className="w-10 h-10 shrink-0 flex items-center justify-center hover:bg-white/10 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={openItem.thumbnail}
                      alt={openItem.thumbnailAlt || openItem.title || ""}
                      className="max-w-full max-h-[80vh] w-auto h-auto object-contain bg-white shadow-2xl"
                    />
                  </motion.div>
                ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative bg-zinc-900 w-full max-w-6xl h-[90vh]   overflow-hidden flex flex-col"
                  onClick={(e) => e.stopPropagation()} // Prevent close on inner click
                >
                  {/* Modal Header */}
                  <div className="flex justify-between items-center p-4 bg-zinc-900 border-b border-white/10 text-white">
                    <div>
                      <h3 className="font-medium">{openItem.title} - {openFiles[pdfIndex]?.name}</h3>
                      <p className="text-xs text-white/50">Document {pdfIndex + 1} of {openFiles.length}</p>
                    </div>
                    <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">✕</button>
                  </div>

                  {/* PDF Display (phones can't show a PDF in a frame: list of documents to open instead) */}
                  <div className="flex-1 bg-white relative">
                    {!canShowPdfInline() ? (
                      <PdfOpenList files={openFiles} activeIndex={pdfIndex} isArabic={isArabic} />
                    ) : (
                    <>
                    {isPdfLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                        {/* Loader */}
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                      </div>
                    )}

                    <iframe
                      key={`${itemIndex}-${pdfIndex}`}
                      src={`/api/pdf-proxy?url=${encodeURIComponent(openFiles[pdfIndex]?.file || "")}#toolbar=0`}
                      className="w-full h-full"
                      onLoad={() => setIsPdfLoading(false)}
                    />
                    </>
                    )}
                  </div>


                  {/* Internal PDF Nav Arrows */}
                  {canShowPdfInline() && openFiles.length > 1 && (
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                      <button onClick={prevPdf} className={`pointer-events-auto w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 border border-white/20 ${isArabic ? "rotate-180" : "rotate-0"}`}>←</button>
                      <button onClick={nextPdf} className={`pointer-events-auto w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 border border-white/20 ${isArabic ? "rotate-180" : "rotate-0"}`}>→</button>
                    </div>
                  )}
                </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
