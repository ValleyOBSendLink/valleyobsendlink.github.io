import { d } from "../asset/js/custom.lib.js";
const { PDFDocument, StandardFonts } = PDFLib;

// search load
const searchLoad = (data, callback, indexs, type = null, favoriteItems) => {
  let search = document.querySelector("#search");

  document.forms["search-form"].onsubmit = (e) => {
    e.preventDefault();
    let finalData = [];
    let usedData = [];
    for (let i = 0; i < data.length; i++) {
      indexs.forEach((value) => {
        if (
          data[i][value].toLowerCase().indexOf(search.value.toLowerCase()) >
            -1 &&
          usedData.indexOf(i) == -1
        ) {
          data[i].push(i + 1);
          finalData.push(data[i]);
          usedData.push(i);
        }
      });
    }
    if (type === null) callback(finalData, 1);
    else {
      type.data = finalData;
      callback(type, 1);
    }
  };

  if (favoriteItems) {
    // let finalData = [];
    // let usedData = [];
    // for (let i = 0; i < data.length; i++) {
    //   favoriteItems.forEach((value) => {
    //     // console.log(value)
    //     if (
    //       data[i][0].toLowerCase().indexOf(value.toLowerCase()) > -1 &&
    //       usedData.indexOf(i) == -1
    //     ) {
    //       data[i].push(i + 1);
    //       finalData.push(data[i]);
    //       usedData.push(i);
    //     }
    //   });
    // }
    // callback(finalData, 1);
    search.onchange = () => {
      let finalData = [];
      let usedData = [];
      for (let i = 0; i < data.length; i++) {
        indexs.forEach((value) => {
          if (
            data[i][value].toLowerCase().indexOf(search.value.toLowerCase()) >
              -1 &&
            usedData.indexOf(i) == -1
          ) {
            data[i].push(i + 1);
            finalData.push(data[i]);
            usedData.push(i);
          }
        });
      }
      if (type === null) callback(finalData, 1);
      else {
        type.data = finalData;
        callback(type, 1);
      }
    };
  }
};

// sortin load
const sortingLoad = (index, data, type, callback, res = null, dom = "") => {
  let condition = false;
  if (dom && dom.innerText == "Sort by Number") {
    condition = true;
  }
  let sortingBtn = document.querySelector("#sortingBtn");
  let loading = document.querySelector("#loading");
  sortingBtn.onclick = () => {
    if (data.length) {
      loading.style.display = "block";

      let data1 = data[0][index];
      if (type == "") {
        data.forEach((v, i) => {
          data[i].push(i + 1);
        });
        type = 1;
      }

      data = data.sort((a, b) => {
        if (condition) {
          let x = a[index].substr(1).substr(0, a[index].substr(1).indexOf("."));
          let y = b[index].substr(1).substr(0, b[index].substr(1).indexOf("."));
          return Number(y) - Number(x);
        }
        //console.log(isNaN(Number(a)), a)
        if (isNaN(Number(a[index])) == false) {
          return a[index] - b[index];
        }
        let x = a[index].substr(1).toLowerCase();
        let y = b[index].substr(1).toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });

      if (data[0][index] === data1) {
        data = data.reverse();
      }

      if (res === null) callback(data, type);
      else {
        res.data = data;
        callback(res, type);
      }
    }
  };
};

// download file
const download = async (id, fileName, obj) => {
  const { GAS, post } = d;
  let loading = document.querySelector("#loading");
  loading.style.display = "block";

  // let data = JSON.parse(
  //   JSON.parse(
  //     await post(GAS, {
  //       type: 17,
  //       data: JSON.stringify({
  //         id: id,
  //       }),
  //     })
  //   ).messege
  // ).data;

  let data = await createPdf(obj);
  const anchor = document.createElement("a");
  if ("download" in anchor) {
    //html5 A[download]

    let extention = fileName.toLowerCase().indexOf(".pdf") >= 0 ? "" : ".pdf";
    anchor.href = data;
    anchor.setAttribute("download", fileName + extention);
    anchor.innerHTML = "downloading...";
    anchor.style.display = "none";
    anchor.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    document.body.appendChild(anchor);
    setTimeout(function () {
      anchor.click();
      document.body.removeChild(anchor);
      loading.style.display = "none";
    }, 66);
  }
};

// break line
const breakLine = (data) => {
  let dataArray = data.split(" ");
  let result = "";
  let line = "";
  let maxChr = 67;

  for (let i = 0; i < dataArray.length; i++) {
    let x = dataArray[i];
    line += x + " ";
    if (line.length > maxChr) {
      line = line.substr(0, line.length - x.length - 1);
      result += line + "\n";
      line = x + " ";
    }

    if (i == dataArray.length - 1) {
      result += line;
    }
  }

  return result;
};

const createPdf = async (obj, pdf) => {
  const fontSize = 13;
  const size = [];

  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let key in obj) {
    size.push(helveticaBold.widthOfTextAtSize(key, fontSize));
  }

  let initY = 50;
  let maxH = helveticaBold.heightAtSize(fontSize);
  let maxW = Math.max(...size);

  const page = pdfDoc.addPage();

  for (let key in obj) {
    page.drawText(key, {
      x: 50,
      y: page.getHeight() - initY,
      size: fontSize,
      font: helveticaBold,
    });

    page.drawText(":", {
      x: maxW + 60,
      y: page.getHeight() - initY,
      size: fontSize,
      font: helveticaBold,
    });

    page.drawText(obj[key], {
      x: maxW + 70,
      y: page.getHeight() - initY,
      size: fontSize,
      font: helvetica,
    });

    initY += maxH + 10;
  }

  let pdfBytes;
  if (pdf) {
    const pdfDoc_ = await PDFDocument.load(pdf);
    const page = await pdfDoc_.copyPages(pdfDoc, [0]);
    pdfDoc_.insertPage(0, page[0]);
    pdfBytes = await pdfDoc_.saveAsBase64({ dataUri: true });
  } else {
    pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
  }

  return pdfBytes;
};

export { searchLoad, sortingLoad, download, breakLine, createPdf };
