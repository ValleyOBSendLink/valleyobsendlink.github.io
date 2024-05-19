"use client";

import Loading from "@/components/Loading";
import Header from "@/components/admin/Header";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import gasFetch, { useGASFetch } from "@/gasFetch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { data, isLoading, error, mutate } = useGASFetch(
    "/admin/get-users",
    {}
  );

  let search = useSearchParams();

  let page = search.get("page") || 1;
  let query = search.get("q") || "";
  let sort = search.get("sort") || "";
  const perPage = 50;

  let finalData_ =
    data?.filter(({ email, password, history, ip, id }) => {
      // anything is find in query
      if (query === "") {
        return true;
      }

      return email?.toLowerCase()?.includes(query.toLowerCase());
    }) || null;

  if (sort && finalData_) {
    finalData_.sort((a, b) => {
      if (a.email.toLowerCase() < b.email.toLowerCase()) {
        return sort === "asc" ? -1 : 1;
      }
      if (a.email.toLowerCase() > b.email.toLowerCase()) {
        return sort === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  let finalData =
    finalData_?.slice((page - 1) * perPage, page * perPage) || null;

  let [state, setState] = useState({
    isOpen: false,
    confirmShow: false,
    isLoading: false,
    error: "",
    isSucess: false,
    title: "Are you sure you want to delete all history?",
    payload: {},
  });

  async function deleteHandler() {
    setState((state) => {
      return { ...state, isLoading: true, error: "", isSucess: false };
    });

    let response = await gasFetch("/admin/delete-history", state.payload);

    let responseJSON = await response.json();

    if (responseJSON.error) {
      setState((state) => {
        return { ...state, error: responseJSON.error, isLoading: false };
      });
      return;
    } else {
      mutate();
      setState((state) => {
        return {
          ...state,
          isOpen: false,
          isLoading: false,
          isSucess: true,
          confirmShow: false,
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
                <Link href="/admin/add-user">
                  <button className="custom-btn">Add New User</button>
                </Link>
                <Link href="/admin/backup">
                  <button className="custom-btn">Backup</button>
                </Link>
                <Link href="/admin/change-password">
                  <button className="custom-btn">Change Password</button>
                </Link>
              </div>

              {isLoading && <Loading />}

              {error && !isLoading && <p>{error}</p>}

              {finalData && (
                <>
                  <table className="custom-table custom-admin-table">
                    <tbody>
                      <tr>
                        <th>Email</th>
                        <th>Passwords</th>
                        <th>History</th>
                        <th> Ip Address</th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        />
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        />
                      </tr>
                      {finalData.map(
                        ({ email, password, history, ip, id }, i) => {
                          return (
                            <tr key={i}>
                              <td>{email}</td>
                              <td>{password}</td>
                              <td>{history} days</td>
                              <td>
                                {ip.split("\n").map((v, i) => {
                                  return <p key={i}>{v}</p>;
                                })}
                              </td>
                              <td>
                                <Link
                                  href={`/admin/history/users?uid=${email}`}
                                >
                                  <button className="tb-btn delete">
                                    <span className="icon">
                                      <img
                                        src="/asset/img/share-clock.png"
                                        alt="History"
                                      />
                                    </span>
                                  </button>
                                </Link>
                              </td>
                              <td>
                                <button
                                  onClick={() => {
                                    setState((state) => {
                                      return {
                                        ...state,
                                        confirmShow: true,
                                        isOpen: true,
                                        payload: {
                                          uid: email,
                                          deleteAll: true,
                                          isPermanent: true,
                                        },
                                        title: `Are you sure you want to delete ${email}?`,
                                      };
                                    });
                                  }}
                                  className="tb-btn delete"
                                >
                                  <span className="icon">
                                    <img
                                      src="/asset/img/Icon-feather-trash.png"
                                      alt="Trash"
                                    />
                                  </span>
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>

                  <Pagination
                    totalEntries={finalData_.length}
                    currentPage={page}
                    perPage={perPage}
                  />
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
              return { ...state, isOpen: false };
            });

            setTimeout(() => {
              setState((state) => {
                return { ...state, confirmShow: false };
              });
            }, 500);
          }}
        >
          <h3 className="text-center">{state.title}</h3>

          {state.error && <p className="inline-status error">{state.error}</p>}

          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setState((state) => {
                  return { ...state, isOpen: false };
                });
              }}
            >
              Close
            </button>
            <button className="btn btn-danger ml-4" onClick={deleteHandler}>
              Cormfirm
            </button>
          </div>
        </Modal>
      )}

      {state.isSucess && (
        <Modal
          opened
          onClose={() => {
            setState((state) => {
              return { ...state, isSucess: false };
            });
          }}
        >
          <div className="text-center">
            <div className="img mb-4">
              <img src="/asset/img/verified.png" alt="Success" />
            </div>
            <h3 className="modal-title text-center">Successfully deleted!</h3>
          </div>
        </Modal>
      )}

      {state.isLoading && <Loading />}
    </section>
  );
}
