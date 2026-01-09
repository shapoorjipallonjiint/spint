import Image from 'next/image';


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-5">
      <Image src="/assets/images/main-logo.png" alt="Logo" width={150} height={150} />
      <p className="text-xl pt-4">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}