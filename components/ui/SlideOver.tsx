import React, { useEffect } from 'react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden z-50 transition-all duration-300 ${
        isOpen ? 'visible' : 'invisible'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        ></div>
        <section
          className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transition-transform duration-500 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="w-screen max-w-2xl">
            <div className="h-full flex flex-col bg-ui-card shadow-xl">
              <div className="flex-shrink-0 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-ui-border">
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-md text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <span className="sr-only">Close panel</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
