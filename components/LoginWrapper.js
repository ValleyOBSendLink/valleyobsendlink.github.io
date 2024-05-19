import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginWrapper({ type }) {
  return (
    <>
      <section id="wrapper">
        <section className="common-sec login-page-sec">
          <div className="container">
            <div className="logo-dv text-center">
              <Link className="navbar-brand" href="/admin">
                <span className="site-logo">
                  <img src="/asset/img/logo.svg" alt="Logo" />
                </span>
              </Link>
            </div>
            <div className="login-form-dv">
              <section className="custom-form-sec">
                <LoginForm type={type} />
              </section>
              {/* custom-form-sec */}
            </div>
            {/* login-form-dv */}
          </div>
          {/* container */}
        </section>
        {/* common-sec */}
      </section>
      {/* wrapper */}
    </>
  );
}
