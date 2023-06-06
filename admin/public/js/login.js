$(document).ready(function () {
  // When the login button is clicked
  $('#login-button').click(function (event) {
    event.preventDefault(); // Stop the default form submission

    // Get the form data
    const email = $('#email').val();
    const password = $('#password').val();
    const formData = { email, password };

    // Send a POST request to the endpoint
    $.post('/admin/api/getToken', formData)
      .done(function (response) {
        localStorage.setItem('adminToken', response.token);
        // Trigger form submission
        $('#login-form').submit();

      })
      .fail(function (error) {
        // Handle the error response
        console.error('Error:', error.responseText);
        $('#error').text('Login failed. Please try again.'); // Display an error message
      });
  });
});
