import LoginWrapper from "@/components/LoginWrapper";
import ForgetPassword from "@/components/admin/ForgetPassword";

export default function ForgetPasswordPage() {
  return (
    <>
      <LoginWrapper type="admin" />;
      <ForgetPassword />
    </>
  );
}
