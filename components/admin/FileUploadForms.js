"use client";

import gasFetch from "@/gasFetch";
import { useRef, useState } from "react";
import { useSWRConfig } from "swr";

export function FileUploadForms() {
  const { mutate } = useSWRConfig();
  const [state, setState] = useState({
    files: {},
  });
  const fileInputRef = useRef(null);

  async function readFiles(...files) {
    return new Promise((resolve, reject) => {
      const data = [];
      const _reader = (file) => {
        let reader = new FileReader();
        reader.onload = () => {
          data.push(reader.result);
          if (file == files.length - 1) resolve(data);
          else _reader(++file);
        };
        reader.onerror = reject;
        reader.readAsDataURL(files[file]);
      };
      _reader(0);
    });
  }

  async function handleFiles(e) {
    let files = e.target.files;
    let filesListObj = {};
    for (let i = files.length - 1; i >= 0; i--) {
      const fileId = crypto.randomUUID();
      const file = files[i];
      let error;
      let icon = "file.svg";
      if (file.type == "application/pdf") {
        icon = "pdf.svg";
        if (file.size >= 50 * 2 ** 20) {
          error = "File size > 50MB.";
        }
      } else {
        error = "File is not a PDF.";
      }

      filesListObj[fileId] = {
        name: file.name,
        base64: (await readFiles(file))[0],
        typeError: error,
        icon: icon,
        success: false,
        isPorcessing: false,
        id: fileId,
        error: "",
      };
    }

    setState((state) => {
      return { ...state, files: { ...state.files, ...filesListObj } };
    });

    e.target.value = "";
  }

  async function uploadFiles(e) {
    e.preventDefault();
    let files = Object.values(state.files);
    for (let i = files.length - 1; i >= 0; i--) {
      let file = files[i];
      if (file.typeError || file.success) continue;

      setState((state) => {
        return {
          ...state,
          files: {
            ...state.files,
            [file.id]: {
              ...file,
              isPorcessing: true,
              error: "",
            },
          },
        };
      });

      try {
        // document.getElementById(file.id).scrollIntoView();
        // Upload file here
        let response = await gasFetch("/admin/add-file", {
          name: file.name,
          base64: file.base64,
        });

        let responseJSON = await response.json();

        if (responseJSON.error) throw new Error(responseJSON.error);

        setState((state) => {
          return {
            ...state,
            files: {
              ...state.files,
              [file.id]: {
                ...file,
                success: true,
                isPorcessing: false,
              },
            },
          };
        });
      } catch (error) {
        setState((state) => {
          return {
            ...state,
            files: {
              ...state.files,
              [file.id]: {
                ...file,
                isPorcessing: false,
                error: error.message,
              },
            },
          };
        });
      }
    }

    mutate(["/admin/get-files", {}]);
  }

  let uploadAbleFiles = Object.values(state.files).filter(
    (file) => !file.typeError && !file.success
  ).length;

  return (
    <div className="drag-and-drop-wrapp">
      <div className="drop-zone">
        <form
          name="documentUploadForm"
          onSubmit={uploadFiles}
          className="formWrappFile"
        >
          <div className="file">
            <div className="file__input" id="file__input">
              <input
                ref={fileInputRef}
                className="file__input--file"
                id="customFile"
                type="file"
                multiple="multiple"
                accept=".pdf"
                onChange={handleFiles}
              />
              <label
                className="file__input--label"
                htmlFor="customFile"
                data-text-btn="Upload"
              >
                <div className="drop-zone__prompt">
                  <h3>Drag &amp; Drop Files Here</h3>
                  <p>PDF only</p>
                  <div className="img">
                    <img
                      src="/asset/img/cloud-computing.png"
                      alt="Upload"
                      disabled
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div style={{ margin: "20px 0 100px" }} id="filesList">
            {Object.keys(state.files).map((key, index) => {
              let { name, typeError, success, error, icon, isPorcessing } =
                state.files[key];
              return (
                <div
                  key={key}
                  id={key}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    fontSize: 16,
                    color: "rgba(0, 0, 0, 0.3)",
                    alignItems: "flex-start",
                    margin: "10px 0",
                    justifyContent: "space-around",
                  }}
                >
                  <img style={{ width: 30 }} src={`/asset/img/${icon}`} />
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      padding: "0 10px",
                      textAlign: "left",
                    }}
                  >
                    <div>{name}</div>
                    {typeError && (
                      <div
                        className="status"
                        style={{ color: "red", fontSize: 10 }}
                      >
                        {typeError}
                      </div>
                    )}
                    {success && (
                      <div
                        className="status"
                        style={{ color: "green", fontSize: 10 }}
                      >
                        Sucessfully uploaded
                      </div>
                    )}
                    {isPorcessing && (
                      <div
                        className="status"
                        style={{ fontSize: 10, color: "#004a7f" }}
                      >
                        Uploading...
                      </div>
                    )}
                    {error && (
                      <div
                        className="status"
                        style={{ color: "red", fontSize: 10 }}
                      >
                        {error}
                      </div>
                    )}
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      let newFiles = { ...state.files };
                      delete newFiles[key];
                      setState((state) => {
                        return { ...state, files: newFiles };
                      });
                    }}
                  >
                    x
                  </div>
                </div>
              );
            })}
          </div>
          <div className="link-dv">
            <button
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current.click();
              }}
              type="button"
              className="custom-btn"
            >
              Select Files
            </button>
            <button
              type="submit"
              className="custom-btn btnUpload"
              disabled={uploadAbleFiles === 0}
              style={{
                display: uploadAbleFiles === 0 ? "none" : "inline-block",
              }}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
