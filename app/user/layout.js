import AuthWrapper from "@/components/AuthWrapper";
import "./user.css";

export const metadata = {
  title: "ValleyOb Gyn User",
  description: "",
};

export default function RootLayout({ children }) {
  return <AuthWrapper type="user">{children}</AuthWrapper>;
}
