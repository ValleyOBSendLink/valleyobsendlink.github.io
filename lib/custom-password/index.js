"use client";

import { useState } from "react";

export default function CustomPassWordInput({
  onChange = (v) => {
    console.info(`Passwoed: ${v}`);
  },
  ...props
}) {
  console.log = () => {};

  const [passwordValue_, setPasswordValue] = useState("");
  const [prePasswordValue_, setPrePasswordValue] = useState("");

  const [passwordInfo_, setPasswordInfo] = useState({
    start: 0,
    end: 0,
    status: false,
  });

  const setCaretPosition = (e, pos) => {
    // Modern browsers
    if (e.setSelectionRange) {
      e.focus();
      e.setSelectionRange(pos, pos);

      // IE8 and below
    } else if (e.createTextRange) {
      let range = e.createTextRange();
      range.collapse(true);
      range.moveEnd("character", pos);
      range.moveStart("character", pos);
      range.select();
    }
  };

  const password = {};

  password.onpaste = (e) => {
    setPrePasswordValue((pre) => {
      return e.clipboardData.getData("text");
    });
  };

  password.onundo = (e) => {
    e.preventDefault();
  };

  password.onselect = (e) => {
    setPasswordInfo((passwordInfo_) => {
      return {
        ...passwordInfo_,

        start: e.target.selectionEnd,
        end: e.target.selectionStart,
        status: true,
      };
    });
  };

  // custom password generate when user input and store orinial value in $password.
  password.oninput = (e) => {
    //console.log(e.target.selectionStart, e.target.selectionEnd);
    if (e.inputType == "historyUndo") return;

    console.log("staus", passwordInfo_.status, e.inputType, e.data);

    if (e.inputType == "insertText" || e.inputType == "insertCompositionText") {
      if (passwordInfo_.status) {
        console.log("passwordInfo");
        setPasswordValue((passwordValue_) => {
          let value =
            passwordValue_.substr(0, passwordInfo_.start) +
            e.data +
            passwordValue_.substr(passwordInfo_.end);

          onChange(value);
          return value;
        });
      } else {
        setPasswordValue((passwordValue_) => {
          console.log(e.data, e.target.selectionStart);
          let value =
            passwordValue_.substr(0, e.target.selectionStart - 1) +
            e.data +
            passwordValue_.substr(e.target.selectionStart - 1);

          onChange(value);
          return value;
        });
      }

      let start = e.target.selectionStart;
      let value = e.target.value;

      console.log(start, value);

      let result = "";
      for (let i of value) {
        result += "•";
      }

      e.target.value = result;
      setCaretPosition(e.target, start);

      return setPasswordInfo((pre) => {
        return {
          ...pre,
          status: false,
        };
      });
    }

    if (e.target.value.length != e.target.selectionStart) {
      setPrePasswordValue(($prePass) => {
        $prePass = $prePass.slice(
          0,
          $prePass.length - e.target.value.length + e.target.selectionStart
        );
        $prePass = e.target.value
          .slice(0, -e.target.value.length + e.target.selectionStart)
          .substr($prePass.length);
        return $prePass;
      });
    } else if (e.inputType == "insertFromPaste") {
      if (passwordInfo_.status) {
        if (passwordInfo_.end <= e.target.value.length) {
          setPasswordInfo((pre) => {
            return {
              ...pre,
              end: e.target.selectionStart,
            };
          });
        }

        setPrePasswordValue(($prePass) => {
          return e.target.value.substr(passwordInfo_.start, passwordInfo_.end);
        });
      } else
        setPrePasswordValue(($prePass) => {
          return e.target.value.substr($prePass.length);
        });
    }

    if (prePasswordValue_) {
      if (passwordInfo_.status) {
        if (e.target.selectionStart <= passwordInfo_.start) {
          setPasswordInfo((pre) => {
            return {
              ...pre,
              start: e.target.selectionStart,
            };
          });
        }

        setPasswordValue(($password) => {
          let value =
            $password.substr(0, passwordInfo_.start) +
            prePasswordValue_ +
            $password.substr(passwordInfo_.end);

          onChange(value);
          return value;
        });
      } else {
        setPasswordValue(($password) => {
          let value =
            $password.substr(
              0,
              e.target.selectionStart - prePasswordValue_.length
            ) +
            prePasswordValue_ +
            $password.substr(
              e.target.selectionStart - prePasswordValue_.length
            );

          onChange(value);
          return value;
        });
      }
    } else {
      setPasswordValue(($password) => {
        let value =
          $password.substr(0, e.target.selectionStart) +
          $password.substr(
            e.target.selectionStart + ($password.length - e.target.value.length)
          );

        onChange(value);
        return value;
      });
    }

    let start = e.target.selectionStart;
    let value = e.target.value;
    let result = "";
    for (let i of value) {
      result += "•";
    }
    e.target.value = result;
    setCaretPosition(e.target, start);

    setPasswordInfo((pre) => {
      return {
        ...pre,
        status: false,
      };
    });

    setPrePasswordValue((v) => "");
  };

  return (
    <input
      type="text"
      onInput={(e) => password.oninput(e.nativeEvent)}
      onSelect={(e) => password.onselect(e.nativeEvent)}
      onPaste={(e) => password.onpaste(e.nativeEvent)}
      {...props}
    />
  );
}
