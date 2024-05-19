"use client";

import Loading from "@/components/Loading";
import Modal from "@/components/ui/Modal";
import gasFetch, { useGASFetch } from "@/gasFetch";
import { useEffect, useState } from "react";

export default function BackUp() {
  const { data, isLoading, error, mutate } = useGASFetch(
    "/admin/get-backup",
    {}
  );
  const [state, setState] = useState({
    email: data || "",
    loading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    setState((state) => {
      return { ...state, email: data || "" };
    });
  }, [data]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (state.loading) return;

    setState((state) => {
      return { ...state, loading: true, error: "", success: "" };
    });

    // if (!state.email) {
    //   return setState((state) => {
    //     return {
    //       ...state,
    //       error: "Backup email is required",
    //     };
    //   });
    // }

    try {
      let response = await gasFetch(`/admin/set-backup`, {
        email: state.email || "",
      });

      let responseJSON = await response.json();

      if (responseJSON.error) {
        setState((state) => {
          return { ...state, error: responseJSON.error, loading: false };
        });
        return;
      } else {
        mutate(state.email);
        setState((state) => {
          return {
            ...state,
            error: "",
            success: "Successfully added backup email",
            loading: false,
          };
        });
      }
    } catch (error) {
      setState((state) => {
        return { ...state, error: error.message, loading: false };
      });
    }
  }

  return (
    <>
      <Modal opened closeRoute="/admin">
        <h3 className="modal-title text-center">Backup</h3>
        <section className="custom-form-sec">
          <form className="icon-form" onSubmit={handleSubmit}>
            <div className="mdl-input-bx">
              <label>Enter Backup Email</label>
              <input
                type="text"
                name=""
                value={state.email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
                disabled={state.loading || error}
                className="form-control"
                autoComplete="off"
                placeholder="Enter Backup Email"
                spellCheck="false"
              />
            </div>
            <button
              disabled={state.loading || error}
              type="submit"
              className="custom-btn popSubmit"
            >
              {state.loading ? "Please wait..." : "Add Backup Email"}
            </button>
            {state.error && (
              <p className="inline-status error">{state.error}</p>
            )}
            {error && <p className="inline-status error">{error}</p>}
            {state.success && (
              <p className="inline-status success">{state.success}</p>
            )}
          </form>
        </section>
      </Modal>

      {isLoading && <Loading />}
    </>
  );
}
