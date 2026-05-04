"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const organizationName = process.env.NEXT_PUBLIC_ORGANIZATION_NAME || "Organization";

  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <p className="text-xs text-gray-600 text-center">
          &copy; {currentYear} {organizationName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
