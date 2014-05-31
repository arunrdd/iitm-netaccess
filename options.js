window.addEventListener('load', function() {
  // Fill in if details are available in local storage.
  if (localStorage.RollNumber){
  options.RollNumber.value = localStorage.RollNumber;}
  if (localStorage.Password){
  options.Password.value = localStorage.Password;}
  if (localStorage.activation){
  options.activation.value = localStorage.activation;}

  options.RollNumber.onkeyup = function() {
    localStorage.RollNumber = options.RollNumber.value;
  };

  options.Password.onkeyup = function() {
    localStorage.Password = options.Password.value;
  };
  options.activation.onchange = function() {
    localStorage.activation = options.activation.value;
    console.log(localStorage.activation.value);
  };
});
