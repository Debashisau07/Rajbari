
      (() => {
        'use strict';
  
        // Fetch all forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation');
  
        // Loop over them and prevent submission if there are invalid fields
        Array.from(forms).forEach(form => {
          form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
              event.preventDefault(); // Prevent form submission if invalid
              event.stopPropagation(); // Stop event propagation
              console.log('Form validation failed.');
            }
            else{
              console.log('Form validation passed.');
            }
  
            // Add Bootstrap 'was-validated' class to show validation feedback
            form.classList.add('was-validated');
          }, false);
        });
      })();
    