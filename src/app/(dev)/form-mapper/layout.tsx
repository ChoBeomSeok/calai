import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Mapper (dev)",
  description: "Developer tool",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
