import AuthWrapper from "@/components/AuthWrapper";

export const metadata = {
  title: "ValleyOb Gyn Admin",
  description: "",
};

export default function RootLayout({ children }) {
  return <AuthWrapper type="admin">{children}</AuthWrapper>;
}
