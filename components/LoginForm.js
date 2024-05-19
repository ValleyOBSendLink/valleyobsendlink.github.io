"use client";

import gasFetch from "@/gasFetch";
import CustomPassWordInput from "@/lib/custom-password";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSWRConfig } from "swr";

export default function LoginForm({ type = "admin" }) {
  const { mutate } = useSWRConfig();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (!username) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      let loginIp =
        type == "user"
          ? await (await fetch("https://ip.39vz8-ip.workers.dev/")).text()
          : "";

      let response = await gasFetch(`/login`, {
        username,
        password,
        type,
        loginIp,
      });

      let responseJSON = await response.json();

      if (responseJSON.error) {
        setError(responseJSON.error);
        setLoading(false);
        return;
      }

      if (responseJSON.data) {
        localStorage.setItem(
          `${type}TokenInfo`,
          JSON.stringify({
            token: responseJSON.data.token,
            expire: new Date().getTime() + 1000 * 60 * 60 * 6,
          })
        );

        mutate(type, true);

        if (type === "admin") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again");
      setLoading(false);
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleLogin} className="icon-form">
      <div className="row">
        <div className="col-sm-12">
          <div className="input-bx">
            <input
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              name="username"
              id="username"
              className="form-control"
              autoComplete="off"
              required
              placeholder="Username"
            />
          </div>
        </div>
        {/* col */}
      </div>
      {/* row */}
      <div className="row">
        <div className="col-sm-12">
          <div className="input-bx pass-bx">
            <CustomPassWordInput
              disabled={loading}
              onChange={(e) => setPassword(e)}
              name="password"
              id="password"
              className="form-control"
              autoComplete="off"
              required
              placeholder="Password"
            />
          </div>
          {type === "admin" && (
            <div className="text-right my-1">
              <Link href="/admin/forget-password">Forgot Password</Link>
            </div>
          )}
        </div>
        {/* col */}
      </div>
      {/* row */}
      <div className="submit mt-4">
        <button
          disabled={loading}
          type="submit"
          className="custom-btn round-btn"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
