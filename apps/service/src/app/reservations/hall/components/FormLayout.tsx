import React from "react";
import Image from "next/image";

export function FormLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <main>
          <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="flex justify-center mb-4">
              <div className="relative" style={{ width: 640, height: 120 }}>
                <Image
                  src="/hall.jpeg"
                  alt="hall"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
