"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Modal({
  opened,
  hideCloseBtn,
  onClose = () => {},
  closeRoute,
  children,
}) {
  const modalBody = useRef(null);
  const ref = useRef(null);
  const backdrop = useRef(null);
  const route = useRouter();

  useEffect(() => {
    if (opened) {
      backdrop.current.classList.add("show");
      ref.current.style.display = "block";

      setTimeout(() => {
        if (!ref.current) return;
        ref.current.classList.add("show");
      }, 200);

      window.addEventListener("click", (e) => {
        if (e.target == ref.current) closeHandler();
      });
    }
  }, [ref, backdrop, modalBody, opened]);

  const closeHandler = () => {
    if (hideCloseBtn) return;
    if (!ref) return;

    ref.current.classList.remove("show");
    backdrop.current.classList.remove("show");

    setTimeout(() => {
      ref.current.style.display = "none";
      onClose();
      if (closeRoute) route.push(closeRoute);
    }, 200);
  };

  return (
    <>
      <div
        ref={ref}
        className="modal fade custom-modal"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content" ref={modalBody}>
            <div className="modal-header">
              {!hideCloseBtn && (
                <button
                  onClick={closeHandler}
                  type="button"
                  className="close ml-auto"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              )}
            </div>
            <div className="modal-body">{children}</div>
            {/* modal-body */}
          </div>
        </div>
      </div>
      <div ref={backdrop} className="modal-backdrop fade"></div>
    </>
  );
}
