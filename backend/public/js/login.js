// $(document).ready(function () {
//   $('#login-form').submit(function (e) {
//     e.preventDefault();
//     const formData = $(this).serializeArray();
//     const formObject = {};

//     // Convert form data array to object
//     formData.forEach(function (input) {
//       formObject[input.name] = input.value;
//     });

//     // Send Axios request
//     axios.post($(this).attr('action'), formObject)
//       .then(function (response) {
//         if (response.status === 200) {
//           const data = response.data;
//           console.log(data);
//           localStorage.setItem('userToken', JSON.stringify(data.user.token));
//         }
//       })
//       .catch(function (error) {
//         $('#error').text("Check again your email and password");
//       });
//   });
// });