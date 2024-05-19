import LoginWrapper from "@/components/LoginWrapper";
import Logout from "@/components/Logout";

export default function LogoutPage() {
  return (
    <Logout type="user">
      <LoginWrapper type="user" />;
    </Logout>
  );
}
