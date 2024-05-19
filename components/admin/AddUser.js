"use client";

import Modal from "@/components/ui/Modal";
import gasFetch from "@/gasFetch";
import { useState } from "react";
import { useSWRConfig } from "swr";

export default function AddUser() {
  const { mutate } = useSWRConfig();
  const [state, setState] = useState({
    email: "",
    password: "",
    history: 0,
    ip: "",
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

    if (!state.email || !state.password) {
      return setState((state) => {
        return {
          ...state,
          loading: false,
          error: "Email, Password is required",
        };
      });
    }

    let response = await gasFetch(`/admin/add-user`, {
      email: state.email,
      password: state.password,
      history: state.history,
      ip: state.ip,
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
          email: "",
          password: "",
          history: 0,
          ip: "",
          error: "",
          success: "User added successfully",
          loading: false,
        };
      });
      mutate(["/admin/get-users", {}]);
    }
  }

  return (
    <Modal opened closeRoute="/admin">
      <h3 className="modal-title text-center">Add New User</h3>
      <section className="custom-form-sec">
        <form className="icon-form" onSubmit={handleSubmit}>
          <div className="mdl-input-bx">
            <label>Email</label>
            <input
              type="text"
              name=""
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
              disabled={state.loading}
              className="form-control"
              autoComplete="off"
              required
              placeholder="Enter Email"
              spellCheck="false"
            />
          </div>
          <div className="mdl-input-bx">
            <label>Password</label>
            <input
              type="text"
              name=""
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
              disabled={state.loading}
              className="form-control"
              autoComplete="off"
              required
              placeholder="Enter Password"
              spellCheck="false"
            />
          </div>
          <div className="mdl-input-bx">
            <label>History</label>
            <select
              name=""
              required
              value={state.history}
              onChange={(e) => setState({ ...state, history: e.target.value })}
              disabled={state.loading}
              className="form-control"
              id="addUserHistory"
            >
              <option value={0}>0 Days</option>
              <option value={7}>7 Days</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
              <option value={180}>180 Days</option>
              <option value={365}>365 Days</option>
            </select>
          </div>
          <div className="mdl-input-bx">
            <label>IP Address (Optional)</label>
            <textarea
              name=""
              value={state.ip}
              onChange={(e) => setState({ ...state, ip: e.target.value })}
              disabled={state.loading}
              className="form-control"
              autoComplete="off"
              placeholder="Enter IP Address"
              spellCheck="false"
            />
          </div>
          <button
            disabled={state.loading}
            type="submit"
            className="custom-btn popSubmit"
          >
            {state.loading ? "Please wait..." : "Add User"}
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
