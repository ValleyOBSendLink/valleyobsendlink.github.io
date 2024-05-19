"use client";

import Loading from "@/components/Loading";
import Header from "@/components/user/Header";
import gasFetch, { useGASFetch } from "@/gasFetch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Modal from "../ui/Modal";

export default function Home() {
  const { data, isLoading, error } = useGASFetch("/user/get-home-info", {});

  let search = useSearchParams();
  let path = "/user";

  let page = search.get("page") || 1;
  let query = search.get("q") || "";
  let sort = search.get("sort") || "";

  let reverseSort = "";
  if (sort === "asc") {
    reverseSort = "desc";
  }

  if (sort === "desc") {
    reverseSort = "";
  }

  if (sort === "") {
    reverseSort = "asc";
  }

  let searchParam = new URLSearchParams(search.toString());
  searchParam.delete("sort");

  let searchFull = searchParam.toString() ? `&${searchParam.toString()}` : "";

  const perPage = 50;

  const { files, mostUsed } = data || {};

  let finalData_ =
    files?.filter(({ name, id }) => {
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

  let finalMostUsed =
    mostUsed?.filter(({ files }) => {
      return files.some(({ name }) => {
        // anything is find in query
        if (query === "") {
          return true;
        }

        return name?.toLowerCase()?.includes(query.toLowerCase());
      });
    }) || null;

  let [state, setState] = useState({
    selectedDocuments: [],
    email: "",
    isLoading: false,
    error: "",
    success: false,
  });

  function setCaretPosition(e, pos) {
    // Modern browsers
    if (e.setSelectionRange) {
      e.focus();
      e.setSelectionRange(pos, pos);

      // IE8 and below
    } else if (e.createTextRange) {
      var range = e.createTextRange();
      range.collapse(true);
      range.moveEnd("character", pos);
      range.moveStart("character", pos);
      range.select();
    }
  }

  const preventInput = (e) => {
    if (
      e.nativeEvent.inputType == "insertText" ||
      e.nativeEvent.inputType == "insertCompositionText"
    ) {
      let start =
        e.nativeEvent.target.selectionStart - e.nativeEvent.data.length;
      e.nativeEvent.target.value =
        e.nativeEvent.target.value.substr(
          0,
          e.nativeEvent.target.selectionStart - e.nativeEvent.data.length
        ) +
        e.nativeEvent.target.value.substr(e.nativeEvent.target.selectionStart);
      setCaretPosition(e.nativeEvent.target, start);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setState((state) => {
      return {
        ...state,
        isLoading: true,
        error: "",
        success: false,
      };
    });

    try {
      if (state.selectedDocuments.length === 0) {
        throw new Error("Please select at least one document");
      }

      if (!state.email) {
        throw new Error("Please enter email");
      }

      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.email)) {
        throw new Error("Please enter valid User Email!");
      }

      let response = await gasFetch(`/user/send`, {
        email: state.email,
        files: state.selectedDocuments,
      });

      let responseJSON = await response.json();

      if (responseJSON.error) {
        throw new Error(responseJSON.error);
      }

      setState((state) => {
        return {
          ...state,
          isLoading: false,
          error: "",
          success: true,
          email: "",
          selectedDocuments: [],
        };
      });
    } catch (error) {
      setState((state) => {
        return {
          ...state,
          isLoading: false,
          error: error.message,
          success: false,
        };
      });
    }
  }

  return (
    <section id="wrapper">
      <Header>
        <div className="file-email-send-bx">
          <form onSubmit={handleSubmit} id="sendEmailForm">
            <input
              type="text"
              id="Email"
              disabled={state.isLoading}
              className="form-control"
              autoComplete="off"
              required
              value={state.email}
              onInput={preventInput}
              onChange={(e) => {
                setState((state) => {
                  return {
                    ...state,
                    email: e.target.value,
                  };
                });
              }}
              placeholder="Copy & Paste Email"
              spellCheck="false"
            />
            <button
              disabled={state.isLoading}
              type="submit"
              className="custom-btn sendBtn"
            >
              {state.isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </Header>

      <main className="site-main">
        <section className="user-backup-sec">
          <div className="container-fluid">
            <div className="user-backup-table-wrapp">
              <Link
                href={
                  searchFull
                    ? `${path}?sort=${reverseSort}${searchFull}`
                    : `${path}?sort=${reverseSort}`
                }
              >
                <div style={{ position: "absolute", left: "-80px" }}>
                  <img
                    id="sortValueBtn"
                    style={{ width: 50, cursor: "pointer" }}
                    src="/asset/img/imgpsh_fullsize_anim.png"
                    alt="Icon"
                  />
                </div>
              </Link>

              {isLoading && <Loading />}

              {error && !isLoading && <p>{error}</p>}

              {finalData && (
                <div
                  className="file-upload-section-wrapp"
                  style={{ maxWidth: 1200 }}
                >
                  <div className="row pt-5">
                    <div className="col-md-6">
                      <div className="select-file-wrapp mt-3">
                        {finalData.map(({ name, id, link }) => {
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
                                <Link target="_blank" href={link}>
                                  {name}
                                </Link>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="select-file-wrapp mt-3">
                        {finalMostUsed.map(({ files, id: mostId }) => {
                          let isAllChecked = files.every(({ id }) =>
                            state.selectedDocuments.includes(id)
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
                                            ...files.map(({ id }) => id),
                                          ],
                                        };
                                      });
                                    } else {
                                      setState((state) => {
                                        return {
                                          ...state,
                                          selectedDocuments:
                                            state.selectedDocuments.filter(
                                              (item) =>
                                                files.every(
                                                  ({ id }) => item !== id
                                                )
                                            ),
                                        };
                                      });
                                    }
                                  }}
                                />
                              </div>

                              <div className="ml-4">
                                {files.map(({ name, id: fileId, link }) => {
                                  let id = `${fileId}`;
                                  let id_ = `${mostId}_${fileId}`;
                                  return (
                                    <div key={id} className="input-checkbox">
                                      <input
                                        type="checkbox"
                                        id={`file_${id_}`}
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
                                        htmlFor={`file_${id_}`}
                                        style={{ color: "#004a7f" }}
                                      >
                                        <Link target="_blank" href={link}>
                                          {name}
                                        </Link>
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
                </div>
              )}
            </div>
          </div>
          {/* container */}
        </section>
        {/* common-sec */}
      </main>

      {state.isLoading && <Loading />}

      {!state.isLoading && (state.error || state.success) && (
        <Modal
          opened
          onClose={() => {
            setState((state) => {
              return { ...state, error: "", success: false };
            });
          }}
        >
          <div className="text-center">
            <div className="img mb-4">
              <img
                src={`/asset/img/${state.success ? "verified" : "error"}.png`}
                alt="Status"
              />
            </div>
            <h3 className="modal-title text-center">
              {state.success ? "Successfully Sent!" : state.error}
            </h3>
          </div>
        </Modal>
      )}
    </section>
  );
}
