"use client";

import Loading from "@/components/Loading";
import Header from "@/components/admin/Header";
import Modal from "@/components/ui/Modal";
import gasFetch, { useGASFetch } from "@/gasFetch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FileUploadForms } from "./FileUploadForms";

export default function Files() {
  const { data, isLoading, error, mutate } = useGASFetch(
    "/admin/get-files",
    {}
  );

  let search = useSearchParams();

  let page = search.get("page") || 1;
  let query = search.get("q") || "";
  let sort = search.get("sort") || "";
  const perPage = 50;

  let finalData_ =
    data?.filter(({ name, id }) => {
      // anything is find in query
      if (query === "") {
        return true;
      }

      return name?.toLowerCase()?.includes(query.toLowerCase());
    }) || null;

  if (sort && finalData_) {
    finalData_.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return sort === "asc" ? -1 : 1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return sort === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  let finalData = finalData_ || null;
  // finalData_?.slice((page - 1) * perPage, page * perPage) || null;

  let [state, setState] = useState({
    isOpen: false,
    confirmShow: false,
    isLoading: false,
    error: "",
    isSuccess: false,
    title: "Are you sure you want to delete all history?",
    type: "delete",
    selectedDocuments: [],
  });

  async function deleteHandler() {
    setState((state) => {
      return { ...state, isLoading: true, error: "", isSuccess: false };
    });

    let response = await gasFetch("/admin/delete-files", {
      ids: state.selectedDocuments,
    });

    let responseJSON = await response.json();

    if (responseJSON.error) {
      setState((state) => {
        return { ...state, error: responseJSON.error, isLoading: false };
      });
    } else {
      mutate();
      setState((state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          selectedDocuments: [],
        };
      });
    }
  }

  async function addMostCommonlyUsed() {
    setState((state) => {
      return { ...state, isLoading: true, error: "", isSuccess: false };
    });

    let response = await gasFetch("/admin/add-to-most-used", {
      ids: state.selectedDocuments,
    });

    let responseJSON = await response.json();

    if (responseJSON.error) {
      setState((state) => {
        return { ...state, error: responseJSON.error, isLoading: false };
      });
    } else {
      setState((state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          selectedDocuments: [],
        };
      });
    }
  }

  return (
    <section id="wrapper">
      <Header />

      <main className="site-main">
        <section className="user-backup-sec">
          <div className="container-fluid">
            <div className="user-backup-table-wrapp">
              <div className="user-popup-btns">
                <Link href="/admin/files/most-commonly-used">
                  <button className="custom-btn">
                    Show Most Commonly Used
                  </button>
                </Link>

                {finalData?.length > 0 && (
                  <button
                    className="custom-btn"
                    onClick={(e) => {
                      let isSelectAll =
                        finalData.length === state.selectedDocuments.length;

                      return setState((state) => {
                        return {
                          ...state,
                          selectedDocuments: isSelectAll
                            ? []
                            : finalData.map(({ id }) => id),
                        };
                      });
                    }}
                  >
                    {(finalData?.length === state.selectedDocuments.length
                      ? "Unselect"
                      : "Select") + " All"}
                  </button>
                )}

                {state.selectedDocuments.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        setState((state) => {
                          return {
                            ...state,
                            confirmShow: true,
                            isOpen: true,
                            type: "most-commonly-used",
                            title: `Are you sure you want to add files to Most Commonly Used?`,
                          };
                        });
                      }}
                      className="custom-btn"
                    >
                      Add to Most Commonly Used
                    </button>

                    <button
                      onClick={() => {
                        setState((state) => {
                          return {
                            ...state,
                            confirmShow: true,
                            isOpen: true,
                            type: "delete",
                            title: `Are you sure you want to delete files?`,
                          };
                        });
                      }}
                      className="custom-btn"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {isLoading && <Loading />}

              {error && !isLoading && <p>{error}</p>}

              {finalData && (
                <>
                  <div
                    className="file-upload-section-wrapp"
                    style={{ maxWidth: 1200 }}
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <div className="select-file-wrapp mt-3">
                          {finalData.map(({ name, id }) => {
                            return (
                              <div key={id} className="input-checkbox">
                                <input
                                  index={1}
                                  type="checkbox"
                                  id={`file_${id}`}
                                  checked={state.selectedDocuments.includes(id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setState((state) => {
                                        return {
                                          ...state,
                                          selectedDocuments: [
                                            ...state.selectedDocuments,
                                            id,
                                          ],
                                        };
                                      });
                                    } else {
                                      setState((state) => {
                                        return {
                                          ...state,
                                          selectedDocuments:
                                            state.selectedDocuments.filter(
                                              (item) => item !== id
                                            ),
                                        };
                                      });
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`file_${id}`}
                                  style={{ color: "#004a7f" }}
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {/* col */}
                      <div className="col-md-6">
                        <FileUploadForms />
                      </div>
                      {/* col */}
                    </div>
                    {/* row */}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* container */}
        </section>
        {/* common-sec */}
      </main>

      {!state.isLoading && state.confirmShow && (
        <Modal
          opened={state.isOpen}
          onClose={() => {
            setState((state) => {
              return { ...state, isOpen: false, isSuccess: false };
            });

            setTimeout(() => {
              setState((state) => {
                return { ...state, confirmShow: false };
              });
            }, 500);
          }}
        >
          {!state.isSuccess && <h3 className="text-center">{state.title}</h3>}

          {state.error && <p className="inline-status error">{state.error}</p>}
          {!state.isSuccess && (
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setState((state) => {
                    return { ...state, isOpen: false, confirmShow: false };
                  });
                }}
              >
                Close
              </button>
              <button
                className="btn btn-danger ml-4"
                onClick={
                  state.type === "delete" ? deleteHandler : addMostCommonlyUsed
                }
              >
                Confirm
              </button>
            </div>
          )}

          {state.isSuccess && (
            <div className="text-center">
              <div className="img mb-4">
                <img src="/asset/img/verified.png" alt="Success" />
              </div>
              <h3 className="modal-title text-center">
                Successfully{" "}
                {state.type === "delete"
                  ? "deleted"
                  : "added to Most Commonly Used"}
                !
              </h3>
            </div>
          )}
        </Modal>
      )}

      {state.isLoading && <Loading />}
    </section>
  );
}
