import { d } from "../../asset/js/custom.lib.js";
let days, years;

for (let date = 1; date <= 31; date++) {
  days += `<option value=${date}>${date}</option>`;
}

for (let year = 2022; year >= 1935; year--) {
  years += `<option value=${year}>${year}</option>`;
}

const verify = `
<section id="wrapper">
		<header class="site-header">
			<div class="container-fluid">
				<nav class="navbar site-navigation">
					<div class="navbar-brand">
						<a href="#">
							<img src="asset/img/client-Valley-Logo.svg" alt="Logo">
						</a>
					</div>
				</nav>
			</div><!-- container -->
		</header>


		<main class="site-main">
			<section class="common-sec">
				<div class="container-fluid">
					
					<div class="date-of-birth-fields">
						<h4 class="heading">Please enter your Date of Birth to read the message</h4>
						<form name="form">
						<div class="dob-wrapp">
							<div class="dob-select dob-month">
								<select required name="" class="form-control" id="">
									<option value="">Month</option>
									<option value="1">Jan</option>
									<option value="2">Feb</option>
									<option value="3">Mar</option>
									<option value="4">Apr</option>
									<option value="5">May</option>
									<option value="6">Jun</option>
									<option value="7">Jul</option>
									<option value="8">Aug</option>
									<option value="9">Sep</option>
									<option value="10">Oct</option>
									<option value="11">Nov</option>
									<option value="12">Dec</option>
								</select>
							</div>

							<div class="dob-select dob-date">
								<select required name="" class="form-control" id="">
									<option value="">Date</option>
									${days}
								</select>
							</div>

							<div class="dob-select dob-year">
								<select required name="" class="form-control" id="">
									<option value="">Year</option>
									${years}
								</select>
							</div>
						</div>

						<div class="input-submit">
							<button id="button" type="submit" class="custom-btn">Submit</button>
						</div>

						<p id="error" style="display: none" class="msg-error">Please enter correct Date of Birth</p>
					</div><!-- date-of-birth-fields -->
					
				</div><!-- container -->
			</section><!-- common-sec -->
		</main>
	</section><!-- wrapper -->

	<!-- Modal Thank you Success message -->
	<div class="modal fade custom-modal verifiedModalClass" id="verifiedDobModal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button style="display: none" type="button" class="close ml-auto" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body text-center">
					<div class="img mb-4">
						<img src="asset/img/verified.png" alt="Success">
					</div>
					<h3 class="modal-title text-center">Thank You!</h3>
					<p>Please Check Your Email.</p>

				</div><!-- modal-body -->
			</div>
		</div>
	</div>
	<!-- modal -->
	
	  <div style="display: none" id="loading">
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
`;

const verifyLoad = () => {
  const { post, GAS, GetURLParameter } = d;
  let loading = document.querySelector("#loading");
  let form = document.forms["form"];
  let button = document.querySelector("#button");
  let error = document.querySelector("#error");

  form.onsubmit = (e) => {
    e.preventDefault();
    loading.style.display = "block";
    error.style.display = "none";
    button.innerText = "Processing..";

    const select = document.querySelectorAll("select");
    let fullDate = [];
    for (let x of select) {
      let value = x.value;
      if (value.length < 2) {
        value = value.padStart(2, "0");
      }
      fullDate.push(value);
    }

    post(GAS, {
      type: 17,
      data: JSON.stringify({
        date: fullDate.join("-"),
        id: GetURLParameter("i"),
        b: GetURLParameter("b"),
      }),
    })
      .then((res) => {
        res = JSON.parse(JSON.parse(res).messege);
        const { result, messege } = res;
        if (result) {
          if (messege == "id") {
            error.style.display = "block";
            button.innerText = "Submit";
            error.innerHTML = "Invalid Link";
            loading.style.display = "none";
          } else if (messege == "link") {
            error.style.display = "block";
            button.innerText = "Submit";
            error.innerHTML = "This link has been expired";
            loading.style.display = "none";
          } else if (messege == "date") {
            error.style.display = "block";
            button.innerText = "Submit";
            error.innerHTML = "Please enter correct Date of Birth";
            loading.style.display = "none";
          } else if (messege == "verify") {
            error.style.display = "block";
            button.innerText = "Submit";
            error.innerHTML = "Date of birth already verified!";
            loading.style.display = "none";
          } else {
            //e.target.reset();
            button.innerText = "Submit";
            loading.style.display = "none";
            $("#verifiedDobModal").modal({
              backdrop: "static",
            });
          }
        }
      })
      .catch((err) => {
        error.style.display = "block";
        button.innerText = "Submit";
        error.innerHTML = "Error found! Please try again.";
        loading.style.display = "none";
      });
  };
};

export { verify, verifyLoad };
