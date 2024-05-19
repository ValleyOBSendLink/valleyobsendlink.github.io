function secureMessageTemplate_(files = []) {
  return `<!doctype html>
<html class="no-js mY-ClAsS">
  <head>
    <meta charset="utf-8" />
    <title>Valley OBGYN Secure Message</title>
  </head>
  <body>
    <span
      >
      ${
        files.map(file => {
          return (`
            <p
              style="
                font-size: 12pt;
                font-family: 'Arial', sans-serif;
                color: #222222;
                margin: 0;
                padding: 0;
              "
            >
              <span style="font-family: 'Arial', sans-serif; color: #222222"
                >${file.name}</span
              >
            </p>
            <p
              style="
                font-size: 12pt;
                font-family: 'Arial', sans-serif;
                color: #222222;
              "
            >
              <span style="color: black"
                ><a
                  href="${file.link}"
                  target="_blank"
                  ><span style="font-family: 'Arial', sans-serif; color: #1155cc"
                    ><u>Please click here to download the file</u></span
                  ></a
                ></span
              >
            </p>
            <p class="MsoNormal" style="margin-bottom: 0in; line-height: normal">
              <span
                style="
                  font-size: 12pt;
                  font-family: 'Arial', sans-serif;
                  color: #222222;
                "
                >&nbsp;</span
              >
            </p>
          `)
        }).join("")
      }

      <p
        dir="ltr"
        style="line-height: 1.2; margin-top: 0pt; margin-bottom: 0pt"
      >
        <span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(34, 34, 34);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          >Thank you.</span
        >
      </p>
      <br />
      <p
        dir="ltr"
        style="line-height: 1.2; margin-top: 0pt; margin-bottom: 0pt"
      >
        <span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(34, 34, 34);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          >Valley OBGYN Medical Group Inc.</span
        >
      </p>
      <br />
      <p
        dir="ltr"
        style="line-height: 1.2; margin-top: 0pt; margin-bottom: 0pt"
      >
        <span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(34, 34, 34);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          >1600 East Florida Avenue, Suite 315</span
        >
      </p>
      <p
        dir="ltr"
        style="line-height: 1.2; margin-top: 0pt; margin-bottom: 0pt"
      >
        <span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(34, 34, 34);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          >Hemet, CA 92544</span
        >
      </p>
      <br />
      <p
        dir="ltr"
        style="line-height: 1.2; margin-top: 0pt; margin-bottom: 0pt"
      >
        <span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(34, 34, 34);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          >Phone: (951) 765-1766</span
        >
      </p>
      <br />
      <p
        dir="ltr"
        style="line-height: 1.2; margin-top: 0pt; margin-bottom: 0pt"
      >
        <a
          href="http://www.valleyobcare.com/"
          style="text-decoration-line: none"
          ><span
            style="
              font-size: 12pt;
              font-family: Arial, sans-serif;
              color: rgb(17, 85, 204);
              font-variant-numeric: normal;
              font-variant-east-asian: normal;
              text-decoration-line: underline;
              text-decoration-skip-ink: none;
              vertical-align: baseline;
            "
            >http://www.valleyobcare.com</span
          ><span
            style="
              font-size: 12pt;
              font-family: Arial, sans-serif;
              color: rgb(34, 34, 34);
              background-color: transparent;
              font-variant-numeric: normal;
              font-variant-east-asian: normal;
              vertical-align: baseline;
            "
            ><br /></span></a
        ><span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(34, 34, 34);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
        >
        </span
        ><span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(34, 34, 34);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          ><br /><br
        /></span>
      </p>
      <p
        dir="ltr"
        style="line-height: 1.2; margin-top: 0pt; margin-bottom: 0pt"
      >
        <span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(0, 0, 0);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          >FOR YOUR PROTECTION THE LINK AND ALL FILES WILL AUTO DELETE IN 30
          DAYS.</span
        >
      </p>
      <br />
      <p
        dir="ltr"
        style="line-height: 1.295; margin-top: 0pt; margin-bottom: 0pt"
      >
        <span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(0, 0, 0);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          >NOTICE: THIS MESSAGE IS CONFIDENTIAL, INTENDED FOR THE NAMED
          RECIPIENT(S) AND MAY CONTAIN INFORMATION THAT IS (I) PROPRIETARY TO
          THE SENDER, AND/OR, (II) PRIVILEGED, CONFIDENTIAL, AND/OR OTHERWISE
          EXEMPT FROM DISCLOSURE UNDER APPLICABLE STATE AND FEDERAL LAW,
          INCLUDING, BUT NOT LIMITED TO, PRIVACY STANDARDS IMPOSED PURSUANT TO
          THE FEDERAL HEALTH INSURANCE PORTABILITY AND ACCOUNTABILITY ACT OF
          1996 ("HIPAA"). IF YOU ARE NOT THE INTENDED RECIPIENT, OR THE EMPLOYEE
          OR AGENT RESPONSIBLE FOR DELIVERING THE MESSAGE TO THE INTENDED
          RECIPIENT, YOU ARE HEREBY NOTIFIED THAT ANY DISSEMINATION,
          DISTRIBUTION OR COPYING OF THIS COMMUNICATION IS STRICTLY PROHIBITED.
          IF YOU HAVE RECEIVED THIS TRANSMISSION IN ERROR, PLEASE NOTIFY US
          IMMEDIATELY BY TELEPHONE AT (951) 765-1766, AND DESTROY THE ORIGINAL
          TRANSMISSION AND ITS ATTACHMENTS WITHOUT READING OR SAVING THEM TO
          DISK. THANK YOU.</span
        >
      </p>
      <br />
      <p
        dir="ltr"
        style="line-height: 1.295; margin-top: 0pt; margin-bottom: 0pt"
      >
        <span
          style="
            font-size: 11pt;
            font-family: Arial, sans-serif;
            color: rgb(255, 0, 0);
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          >PLEASE NOTE: THIS E-MAIL MESSAGE WAS SENT FROM A NOTIFICATION-ONLY
          ADDRESS THAT CANNOT ACCEPT INCOMING E-MAIL. PLEASE DO NOT REPLY TO
          THIS MESSAGE.</span
        >
      </p>
      <div>
        <span
          style="
            font-size: 11pt;
            font-family: Arial, sans-serif;
            color: rgb(255, 0, 0);
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          ><br
        /></span></div
    ></span>
  </body>
</html>`;
}
