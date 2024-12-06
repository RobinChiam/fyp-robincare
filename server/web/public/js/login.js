// Disable the submit button after the form is submitted
function disableButton(form) {
    const submitBtn = form.querySelector('#submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Logging in...'; // Optional: change button text
  }