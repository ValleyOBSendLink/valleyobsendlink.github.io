import LoginWrapper from "@/components/LoginWrapper";
import Logout from "@/components/Logout";

export default function LogoutPage() {
  return (
    <Logout type="admin">
      <LoginWrapper type="admin" />;
    </Logout>
  );
}
