"use client";

import Modal from "@/components/ui/Modal";
import gasFetch from "@/gasFetch";
import { useState } from "react";

export default function ChangePassword() {
  const [state, setState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    loading: false,
    error: "",
    success: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (state.loading) return;

    setState((state) => {
      return { ...state, loading: true, error: "", success: "" };
    });

    if (!state.currentPassword) {
      return setState((state) => {
        return {
          ...state,
          error: "Current password is required",
          loading: false,
        };
      });
    }

    if (!state.newPassword) {
      return setState((state) => {
        return {
          ...state,
          error: "New password is required",
          loading: false,
        };
      });
    }

    if (state.newPassword !== state.confirmPassword) {
      return setState((state) => {
        return {
          ...state,
          error: "Passwords do not match",
          loading: false,
        };
      });
    }

    let response = await gasFetch(`/admin/change-password`, {
      currentPassword: state.currentPassword,
      newPassword: state.newPassword,
    });

    let responseJSON = await response.json();

    if (responseJSON.error) {
      setState((state) => {
        return { ...state, error: responseJSON.error, loading: false };
      });
      return;
    } else {
      setState((state) => {
        return {
          ...state,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          error: "",
          success: "Successfully changed password",
          loading: false,
        };
      });
    }
  }

  return (
    <Modal opened closeRoute="/admin">
      <h3 className="modal-title text-center">Change Password</h3>
      <section className="custom-form-sec">
        <form className="icon-form" onSubmit={handleSubmit}>
          <div className="mdl-input-bx">
            <label>Current Password</label>
            <input
              type="text"
              name=""
              value={state.currentPassword}
              onChange={(e) =>
                setState((state) => {
                  return { ...state, currentPassword: e.target.value };
                })
              }
              disabled={state.loading}
              className="form-control"
              autoComplete="off"
              required
              placeholder="Enter Current Password"
              spellCheck="false"
            />
          </div>
          <div className="mdl-input-bx">
            <label>New Password</label>
            <input
              type="text"
              name=""
              value={state.newPassword}
              onChange={(e) =>
                setState((state) => {
                  return { ...state, newPassword: e.target.value };
                })
              }
              disabled={state.loading}
              className="form-control"
              autoComplete="off"
              required
              placeholder="Enter New Password"
              spellCheck="false"
            />
          </div>
          <div className="mdl-input-bx">
            <label>Confirm Password</label>
            <input
              type="text"
              name=""
              value={state.confirmPassword}
              onChange={(e) =>
                setState((state) => {
                  return { ...state, confirmPassword: e.target.value };
                })
              }
              disabled={state.loading}
              className="form-control"
              autoComplete="off"
              required
              placeholder="Enter Confirm Password"
              spellCheck="false"
            />
          </div>
          <button
            disabled={state.loading}
            type="submit"
            className="custom-btn popSubmit"
          >
            {state.loading ? "Please wait..." : "Change Password"}
          </button>
          {state.error && <p className="inline-status error">{state.error}</p>}
          {state.success && (
            <p className="inline-status success">{state.success}</p>
          )}
        </form>
      </section>
    </Modal>
  );
}
