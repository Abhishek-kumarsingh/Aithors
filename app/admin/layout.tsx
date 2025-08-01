import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Aithor",
  description: "Administrative dashboard for managing the Aithor platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
