"use client";

import H2Title from "@/app/components/common/H2Title";
import { moveUp } from "@/app/components/motionVarients";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import "swiper/css";

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
  const [isPdfLoading, setIsPdfLoading] = useState(true);


  // State for PDF Popup
  const [itemIndex, setItemIndex] = useState(null); // Tracks which card is open
  const [pdfIndex, setPdfIndex] = useState(0); // Tracks which PDF in the array is active

  // Close Modal Handler
  const closeModal = () => {
    setItemIndex(null);
    setPdfIndex(0);
  };

  // PDF Navigation Logic
  const nextPdf = () => {
    const pdfArray = t.items[itemIndex].files;
    setPdfIndex((prev) => (prev + 1) % pdfArray.length);
  };

  const prevPdf = () => {
    const pdfArray = t.items[itemIndex].files;
    setPdfIndex((prev) => (prev - 1 + pdfArray.length) % pdfArray.length);
  };

  useEffect(() => {
    if (itemIndex !== null) {
      setIsPdfLoading(true);
    }
  }, [itemIndex, pdfIndex]);


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
    <section className="pt-text90 pb25 bg-primary">
      <div className="container ">
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
        <div className="relative">
          <div className="md:hidden mt-5 border-t border-white/20">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={2}
              loop={true}
              autoplay={{ delay: 8000, disableOnInteraction: false }}
              onSwiper={setImageSwiper}
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
              className="legacy-main-swiper"
            >
              {t.items.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="grid grid-cols-1 gap-7 items-center pt-6 pb-4 border-b border-white/20">

                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.thumbnailAlt}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => {
                          setItemIndex(i);
                          setPdfIndex(0);
                        }}
                      />
                      <motion.h3
                        // variants={moveUp(0)}
                        // initial="hidden"
                        // whileInView="show"
                        // viewport={{ amount: 0.2, once: true }}
                        className="text-19 lg:text-29 mt-7 text-white font-light leading-[1.312]  max-w-[15ch]"
                      >
                        {item.title}
                      </motion.h3>

                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>


          <div className="hidden md:block mt-5 xl:mt-50px border-t border-white/20">

            <div className="grid grid-cols-1  md:grid-cols-3  3xl:grid-cols-[520px_550px_550px]  gap-2 lg:gap-23 3xl:gap-0 ">
              {t.items.map((item, index) => (
                <div key={index} className="p-6 lg:p-10 lg:pb-5 md:border-l border-white/20 md:last:border-r border-b md:border-b-0">
                  <motion.img
                    width={276}
                    height={400}
                    src={item.thumbnail}
                    alt={item.thumbnailAlt}
                    className="  cursor-pointer  "
                    onClick={() => { setItemIndex(index); setPdfIndex(0); }}

                  />
                  <motion.h3
                    variants={moveUp(0.5 + 0.2 * index)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="text-19 lg:text-29 mt-7 text-white font-light leading-[1.312]  max-w-[15ch]"
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    variants={moveUp(0.5 + 0.2 * index)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="text-19   mt-4 text-white font-light leading-[1.2]   "
                  >
                    {item.subTitle}
                  </motion.p>
                </div>
              ))}
            </div>
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
                      <h3 className="font-medium">{t.items[itemIndex].title} - {t.items[itemIndex].files[pdfIndex].name}</h3>
                      <p className="text-xs text-white/50">Document {pdfIndex + 1} of {t.items[itemIndex].files.length}</p>
                    </div>
                    <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">✕</button>
                  </div>

                  {/* PDF Display */}
                  <div className="flex-1 bg-white relative">
                    {isPdfLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                        {/* Loader */}
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                      </div>
                    )}

                    <iframe
                      key={`${itemIndex}-${pdfIndex}`}
                      src={`/api/pdf-proxy?url=${encodeURIComponent(
                        t.items[itemIndex].files[pdfIndex].file
                      )}#toolbar=0`}
                      className="w-full h-full"
                      onLoad={() => setIsPdfLoading(false)}
                    />
                  </div>


                  {/* Internal PDF Nav Arrows */}
                  {t.items[itemIndex].files.length > 1 && (
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                      <button onClick={prevPdf} className={`pointer-events-auto w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 border border-white/20 ${isArabic ? "rotate-180" : "rotate-0"}`}>←</button>
                      <button onClick={nextPdf} className={`pointer-events-auto w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 border border-white/20 ${isArabic ? "rotate-180" : "rotate-0"}`}>→</button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
