"use client";

import Loading from "@/components/Loading";
import Header from "@/components/admin/Header";
import Modal from "@/components/ui/Modal";
import gasFetch, { useGASFetch } from "@/gasFetch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MostCommonlyUsed() {
  const { data, isLoading, error, mutate, isValidating } = useGASFetch(
    "/admin/get-most-used",
    {}
  );

  let search = useSearchParams();

  let page = search.get("page") || 1;
  let query = search.get("q") || "";
  let sort = search.get("sort") || "";
  const perPage = 50;

  let finalData =
    data?.filter(({ files }) => {
      return files.some(({ name }) => {
        // anything is find in query
        if (query === "") {
          return true;
        }

        return name?.toLowerCase()?.includes(query.toLowerCase());
      });
    }) || null;

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

  async function removeMostCommonlyUsed() {
    setState((state) => {
      return { ...state, isLoading: true, error: "", isSuccess: false };
    });

    let response = await gasFetch("/admin/remove-most-used", {
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

  return (
    <section id="wrapper">
      <Header />

      <main className="site-main">
        <section className="user-backup-sec">
          <div className="container-fluid">
            <div className="user-backup-table-wrapp">
              <div className="user-popup-btns">
                <Link href="/admin/files">
                  <button className="custom-btn">All Files</button>
                </Link>
                {state.selectedDocuments.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        setState((state) => {
                          return {
                            ...state,
                            confirmShow: true,
                            isOpen: true,
                            title: `Are you sure you want to remove from Most Commonly Used?`,
                          };
                        });
                      }}
                      className="custom-btn"
                    >
                      Remove from Most Commonly Used
                    </button>
                  </>
                )}
              </div>

              {(isLoading || isValidating) && <Loading />}

              {error && !isLoading && <p>{error}</p>}

              {finalData && (
                <>
                  <div
                    className="file-upload-section-wrapp"
                    style={{ maxWidth: 1200 }}
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <div className="select-file-wrapp mt-3">
                          {finalData.map(({ files, id: mostId }) => {
                            let isAllChecked = files.every(({ id }) =>
                              state.selectedDocuments.includes(
                                `${mostId}_${id}`
                              )
                            );
                            return (
                              <div className="d-flex mt-4" key={mostId}>
                                <div className="input-checkbox">
                                  <input
                                    checked={isAllChecked}
                                    type="checkbox"
                                    id={`most_${mostId}`}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setState((state) => {
                                          return {
                                            ...state,
                                            selectedDocuments: [
                                              ...state.selectedDocuments,
                                              ...files.map(
                                                ({ id }) => `${mostId}_${id}`
                                              ),
                                            ],
                                          };
                                        });
                                      } else {
                                        setState((state) => {
                                          return {
                                            ...state,
                                            selectedDocuments:
                                              state.selectedDocuments.filter(
                                                (item) => !item.includes(mostId)
                                              ),
                                          };
                                        });
                                      }
                                    }}
                                  />
                                </div>

                                <div className="ml-4">
                                  {files.map(({ name, id: fileId }) => {
                                    let id = `${mostId}_${fileId}`;
                                    return (
                                      <div key={id} className="input-checkbox">
                                        <input
                                          type="checkbox"
                                          id={`file_${id}`}
                                          checked={state.selectedDocuments.includes(
                                            id
                                          )}
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
                            );
                          })}
                        </div>
                      </div>
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
                onClick={removeMostCommonlyUsed}
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
                Successfully removed from Most Commonly Used!
              </h3>
            </div>
          )}
        </Modal>
      )}

      {state.isLoading && <Loading />}
    </section>
  );
}
