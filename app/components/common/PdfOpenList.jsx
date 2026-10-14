"use client";

// Phones (Android Chrome, iOS Safari, Chrome's mobile emulation) can't show a PDF inside an <iframe>
// ("This page has been blocked by Chrome" / blank / first page only), desktop browsers can.
// Only call this in the browser (e.g. while a popup opened by a click is rendering).
export const canShowPdfInline = () =>
    typeof navigator !== "undefined" &&
    navigator.pdfViewerEnabled !== false &&
    !/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export const pdfProxyUrl = (file) => `/api/pdf-proxy?url=${encodeURIComponent(file)}`;

// Shown in the certificate popup instead of the PDF frame on phones: one button per document,
// opening it in the phone's own PDF viewer (new tab). The current document is highlighted.
const PdfOpenList = ({ files, activeIndex = 0, isArabic = false }) => (
    <div className="w-full h-full overflow-y-auto bg-zinc-900 text-white p-6 flex flex-col items-center justify-center gap-5">
        <p className="text-sm text-white/70 text-center max-w-[32ch]">
            {isArabic ? "اضغط على شهادة لفتحها" : "Tap a certificate to open it"}
        </p>
        <div className="w-full max-w-sm flex flex-col gap-2">
            {files.map((f, i) => (
                <a
                    key={i}
                    href={pdfProxyUrl(f.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-sm transition-colors ${
                        i === activeIndex ? "border-secondary bg-white/10" : "border-white/20 hover:bg-white/5"
                    }`}
                >
                    <span>{f.name || `Document ${i + 1}`}</span>
                    <span className="text-xs text-white/60 uppercase">{isArabic ? "فتح" : "Open PDF"}</span>
                </a>
            ))}
        </div>
    </div>
);

export default PdfOpenList;
