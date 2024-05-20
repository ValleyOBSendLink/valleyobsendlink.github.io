"use client";

import Loading from "@/components/Loading";
import Header from "@/components/admin/Header";
import Modal from "@/components/ui/Modal";
import gasFetch, { useGASFetch } from "@/gasFetch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";

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
    minimize: false,
    isUpdate: false,
    minimizeAll: false,
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

  async function saveOrder() {
    let order = [];
    data.forEach(({ id, files }) => {
      return order.push(
        ...files.map(({ id: fileId }) => [new Date().toISOString(), id, fileId])
      );
    });

    setState((state) => {
      return { ...state, isLoading: true, error: "", isSuccess: false };
    });

    let response = await gasFetch("/admin/save-most-used-order", {
      order,
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
          isUpdate: false,
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
                <button
                  onClick={() => {
                    setState((state) => {
                      return {
                        ...state,
                        minimizeAll: !state.minimizeAll,
                      };
                    });
                  }}
                  className="custom-btn"
                >
                  {(state.minimizeAll && "Expand All") || "Minimize All"}
                </button>
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
                {state.isUpdate && (
                  <button
                    onClick={() => {
                      setState((state) => {
                        return {
                          ...state,
                          confirmShow: true,
                          isOpen: true,
                          type: "update",
                          title: `Are you sure you want to save the order?`,
                        };
                      });
                    }}
                    className="custom-btn"
                  >
                    Save Order
                  </button>
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
                          <ReactSortable
                            list={finalData}
                            setList={(newState) => {
                              mutate(newState, false);
                            }}
                            animation={150}
                            onChoose={() => {
                              setState((state) => {
                                return { ...state, minimize: true };
                              });
                            }}
                            onUnchoose={() => {
                              setState((state) => {
                                return { ...state, minimize: false };
                              });
                            }}
                            onUpdate={() => {
                              setState((state) => {
                                return { ...state, isUpdate: true };
                              });
                            }}
                          >
                            {finalData.map(({ files, id: mostId }) => {
                              let isAllChecked = files.every(({ id }) =>
                                state.selectedDocuments.includes(
                                  `${mostId}_${id}`
                                )
                              );
                              return (
                                <div
                                  className={`d-flex mt-4 ${
                                    state.minimize || state.minimizeAll
                                      ? "make-height-sm"
                                      : ""
                                  }`}
                                  key={mostId}
                                >
                                  <div className="input-checkbox">
                                    <svg
                                      fill="#000000"
                                      version="1.1"
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      viewBox="0 0 330 330"
                                      xmlSpace="preserve"
                                      width={18}
                                      height={18}
                                      style={{
                                        marginTop: "4px",
                                      }}
                                    >
                                      <g>
                                        <path
                                          id="XMLID_225_"
                                          d="M326.602,174.506c0.139-0.17,0.26-0.349,0.392-0.524c0.162-0.216,0.33-0.428,0.48-0.654 c0.144-0.213,0.267-0.435,0.397-0.654c0.12-0.2,0.246-0.396,0.356-0.603c0.12-0.225,0.223-0.457,0.331-0.687 c0.101-0.214,0.207-0.424,0.299-0.643c0.093-0.225,0.168-0.455,0.25-0.683c0.083-0.233,0.173-0.463,0.245-0.702 c0.069-0.231,0.121-0.465,0.18-0.699c0.061-0.241,0.128-0.479,0.177-0.725c0.054-0.272,0.086-0.547,0.125-0.822 c0.03-0.21,0.07-0.416,0.091-0.629c0.098-0.986,0.098-1.979,0-2.965c-0.021-0.213-0.061-0.419-0.091-0.629 c-0.039-0.274-0.071-0.55-0.125-0.822c-0.049-0.246-0.116-0.483-0.177-0.725c-0.059-0.233-0.11-0.468-0.18-0.699 c-0.072-0.238-0.162-0.468-0.245-0.702c-0.082-0.228-0.157-0.458-0.25-0.683c-0.092-0.219-0.198-0.429-0.299-0.643 c-0.108-0.23-0.211-0.461-0.331-0.687c-0.11-0.206-0.236-0.403-0.356-0.603c-0.131-0.219-0.254-0.441-0.397-0.654 c-0.15-0.226-0.318-0.438-0.48-0.654c-0.132-0.175-0.253-0.354-0.392-0.524c-0.315-0.384-0.646-0.753-0.998-1.103l-54.995-54.997 c-5.856-5.857-15.354-5.858-21.213-0.001c-5.858,5.858-5.858,15.355,0,21.213L278.788,150H180V51.213l29.394,29.393 c2.929,2.929,6.768,4.393,10.606,4.393s7.678-1.464,10.606-4.393c5.858-5.858,5.858-15.355,0-21.213L175.609,4.396 c-0.347-0.346-0.711-0.675-1.089-0.987c-0.1-0.082-0.207-0.151-0.308-0.23c-0.285-0.223-0.571-0.444-0.872-0.646 c-0.094-0.063-0.194-0.115-0.289-0.175c-0.318-0.203-0.639-0.403-0.973-0.582c-0.07-0.038-0.145-0.067-0.216-0.104 c-0.363-0.188-0.731-0.368-1.112-0.526c-0.05-0.02-0.103-0.036-0.153-0.056c-0.401-0.162-0.809-0.311-1.226-0.439 c-0.056-0.017-0.112-0.026-0.167-0.043c-0.411-0.12-0.827-0.23-1.252-0.315c-0.128-0.025-0.259-0.037-0.388-0.059 c-0.354-0.061-0.706-0.124-1.067-0.159C166.002,0.026,165.503,0,165,0c-0.502,0-1.002,0.026-1.497,0.076 c-0.368,0.037-0.727,0.1-1.087,0.162c-0.122,0.021-0.247,0.032-0.368,0.056c-0.433,0.086-0.854,0.197-1.272,0.32 c-0.049,0.014-0.098,0.023-0.146,0.038c-0.425,0.129-0.84,0.282-1.249,0.447c-0.042,0.018-0.087,0.03-0.129,0.047 c-0.388,0.161-0.764,0.344-1.135,0.536c-0.063,0.033-0.131,0.06-0.194,0.093c-0.341,0.184-0.669,0.387-0.994,0.595 c-0.088,0.056-0.18,0.105-0.268,0.163c-0.31,0.207-0.605,0.435-0.898,0.665c-0.093,0.072-0.19,0.136-0.282,0.211 c-0.379,0.312-0.743,0.641-1.09,0.987L99.396,59.393c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0 L150,51.214V150H51.213l29.394-29.394c5.858-5.858,5.858-15.355,0-21.213c-5.857-5.858-15.355-5.858-21.213,0L4.397,154.391 c-0.351,0.35-0.683,0.719-0.998,1.103c-0.139,0.17-0.261,0.349-0.392,0.524c-0.162,0.216-0.33,0.428-0.48,0.654 c-0.144,0.213-0.267,0.435-0.398,0.654c-0.12,0.2-0.246,0.396-0.356,0.603c-0.121,0.225-0.223,0.457-0.331,0.687 c-0.101,0.214-0.207,0.424-0.299,0.643c-0.093,0.225-0.168,0.455-0.25,0.683c-0.083,0.233-0.173,0.463-0.245,0.702 c-0.069,0.231-0.121,0.465-0.18,0.699c-0.061,0.241-0.128,0.479-0.177,0.725c-0.054,0.272-0.087,0.547-0.125,0.822 c-0.03,0.21-0.07,0.416-0.091,0.629c-0.098,0.986-0.098,1.979,0,2.965c0.021,0.213,0.061,0.419,0.091,0.629 c0.038,0.274,0.071,0.55,0.125,0.822c0.049,0.246,0.116,0.483,0.177,0.725c0.059,0.233,0.11,0.468,0.18,0.699 c0.072,0.238,0.162,0.468,0.245,0.702c0.082,0.228,0.157,0.458,0.25,0.683c0.092,0.219,0.198,0.429,0.299,0.643 c0.108,0.23,0.21,0.461,0.331,0.687c0.11,0.206,0.236,0.403,0.356,0.603c0.131,0.219,0.254,0.441,0.398,0.654 c0.15,0.226,0.318,0.438,0.48,0.654c0.131,0.175,0.253,0.354,0.392,0.524c0.316,0.384,0.647,0.753,0.998,1.103l54.997,54.997 C62.322,233.536,66.161,235,70,235s7.678-1.464,10.606-4.394c5.858-5.858,5.858-15.355,0-21.213L51.213,180H150v98.786 l-29.392-29.392c-5.857-5.858-15.355-5.857-21.213,0c-5.858,5.858-5.858,15.355,0,21.213l54.995,54.997 c0.347,0.347,0.711,0.676,1.09,0.987c0.092,0.075,0.189,0.138,0.282,0.21c0.293,0.23,0.588,0.458,0.898,0.665 c0.088,0.058,0.18,0.106,0.268,0.163c0.325,0.208,0.653,0.412,0.994,0.595c0.063,0.034,0.131,0.06,0.194,0.093 c0.371,0.192,0.747,0.375,1.135,0.536c0.042,0.018,0.087,0.03,0.129,0.047c0.409,0.165,0.824,0.318,1.249,0.447 c0.049,0.015,0.098,0.023,0.146,0.038c0.418,0.123,0.84,0.233,1.272,0.32c0.121,0.024,0.246,0.035,0.368,0.056 c0.359,0.063,0.719,0.125,1.087,0.162c0.495,0.05,0.995,0.076,1.497,0.076s1.002-0.026,1.497-0.076 c0.368-0.037,0.727-0.1,1.087-0.162c0.122-0.022,0.247-0.032,0.368-0.056c0.433-0.086,0.854-0.197,1.272-0.32 c0.049-0.014,0.098-0.023,0.146-0.038c0.425-0.129,0.84-0.282,1.249-0.447c0.042-0.018,0.087-0.03,0.129-0.047 c0.388-0.161,0.764-0.344,1.135-0.536c0.063-0.033,0.131-0.06,0.194-0.093c0.341-0.184,0.669-0.387,0.994-0.595 c0.088-0.056,0.18-0.104,0.268-0.163c0.31-0.207,0.605-0.435,0.898-0.665c0.093-0.072,0.19-0.136,0.282-0.21 c0.379-0.312,0.743-0.641,1.09-0.987l54.997-54.997c5.858-5.857,5.858-15.355,0-21.213c-5.856-5.857-15.354-5.858-21.213,0 L180,278.787V180h98.788l-29.393,29.394c-5.858,5.858-5.858,15.355,0,21.213c2.929,2.929,6.768,4.393,10.607,4.393 c3.839,0,7.678-1.465,10.606-4.394l54.995-54.997C325.955,175.259,326.286,174.89,326.602,174.506z"
                                        />
                                      </g>
                                    </svg>

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
                                                  (item) =>
                                                    !item.includes(mostId)
                                                ),
                                            };
                                          });
                                        }
                                      }}
                                    />
                                  </div>

                                  <div className="ml-4">
                                    {files.map(
                                      ({ name, id: fileId }, index) => {
                                        let id = `${mostId}_${fileId}`;
                                        if (
                                          (state.minimize ||
                                            state.minimizeAll) &&
                                          index > 0
                                        )
                                          return null;
                                        return (
                                          <div
                                            key={id}
                                            className="input-checkbox"
                                          >
                                            {!(
                                              state.minimize ||
                                              state.minimizeAll
                                            ) && (
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
                                                            (item) =>
                                                              item !== id
                                                          ),
                                                      };
                                                    });
                                                  }
                                                }}
                                              />
                                            )}
                                            <label
                                              htmlFor={`file_${id}`}
                                              style={{ color: "#004a7f" }}
                                            >
                                              {name}
                                            </label>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </ReactSortable>
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
                onClick={
                  state.type === "delete" ? removeMostCommonlyUsed : saveOrder
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
                {(state.type === "delete" && "Removed Successfully") ||
                  "Order Saved Successfully"}
              </h3>
            </div>
          )}
        </Modal>
      )}

      {state.isLoading && <Loading />}
    </section>
  );
}
