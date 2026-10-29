export default function WhatsAppButton() {
  const message = encodeURIComponent("Hello Gurgaon Painters, I would like to discuss a painting project.");

  return (
    <a
      href={`https://wa.me/919717256514?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Gurgaon Painters by Home Glazer on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E] sm:flex sm:bottom-6 sm:right-6"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M16.02 3a12.8 12.8 0 0 0-10.9 19.52L3.4 29l6.65-1.74A12.9 12.9 0 1 0 16.02 3Zm0 23.4c-1.95 0-3.86-.52-5.53-1.52l-.4-.24-3.95 1.03 1.05-3.84-.26-.42A10.48 10.48 0 1 1 16.02 26.4Zm5.75-7.85c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.72.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.59-.95-.84-1.59-1.88-1.78-2.2-.18-.32-.02-.5.14-.66.14-.14.32-.38.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.62c-.22 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.68s1.16 3.1 1.32 3.31c.16.22 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.14-.29-.22-.61-.38Z" />
      </svg>
    </a>
  );
}
