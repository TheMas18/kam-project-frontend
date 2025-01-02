export const ValidateInputFields = (regxElementName, elementValue, inputElement, setIsValid) => {
  let isValid = true;

  // Validation for leadName and leadAssignedKam
  if (regxElementName === "leadName" || regxElementName === "leadAssignedKam" || regxElementName === "contactName"|| regxElementName === "interactionLoggedBy") {
    let updatedInputValue = elementValue.replace(/[^A-Za-z ]/g, "");

    if (elementValue !== updatedInputValue) {
      setIsValid(prev => ({ ...prev, [regxElementName]: false }));
      showError(inputElement, "Only alphabets and spaces are allowed.");
      return false;
    } else if (updatedInputValue.length < 2) {
      setIsValid(prev => ({ ...prev, [regxElementName]: false }));
      showError(inputElement, `${regxElementName} should contain at least 2 characters.`);
      return false;
    } else if (
      (regxElementName === "leadAssignedKam" && elementValue === document.querySelector("#leadName").value) ||
      (regxElementName === "leadName" && elementValue === document.querySelector("#leadAssignedKam").value)
    ) {
      setIsValid(prev => ({ ...prev, [regxElementName]: false }));
      showError(inputElement, "Lead Name and Assigned KAM name cannot match.");
      return false;
    } else {
      setIsValid(prev => ({ ...prev, [regxElementName]: true }));
      showValid(inputElement);
      return true;
    }
  }
  
  // Validation for leadContact
  else if (regxElementName === "leadContact" ||regxElementName === "contactPhoneNumber") {
      let newInputValue = elementValue.replace(/[^\d]/g, "");
      if (!newInputValue.match(/^[6-9]/)) {
        setIsValid(prev => ({ ...prev, [regxElementName]: false }));
        showError(inputElement, "Number should start with 6, 7, 8, or 9.");
        return false;
      } else  if (newInputValue.length !== 10) {
          setIsValid(prev => ({ ...prev, [regxElementName]: false }));
          showError(inputElement, "Contact number must be exactly 10 digits.");
          return false;
      } else {
          setIsValid(prev => ({ ...prev, [regxElementName]: true }));
          showValid(inputElement);
          return true;
      }
  }

  // Validation for leadAddress
  else if (regxElementName === "leadAddress" || regxElementName === "interactionNotes") {
      if (elementValue.trim() === "") {
          setIsValid(prev => ({ ...prev, [regxElementName]: false }));
          showError(inputElement, "Address cannot be empty.");
          return false;
      } else {
          setIsValid(prev => ({ ...prev, [regxElementName]: true }));
          showValid(inputElement);
          return true;
      }
  }

  // Validation for Date (leadLastCallDate)
  else if (regxElementName === "leadLastCallDate" || regxElementName === "interactionDate" ) {
      const [year, month, day] = elementValue.split("-").map(Number);

      if (!year || year < 1900 || year > new Date().getFullYear()) {
          setIsValid(prev => ({ ...prev, [regxElementName]: false }));
          showError(inputElement, "Enter a valid year.");
          return false;
      } else if (!month || month < 1 || month > 12) {
          setIsValid(prev => ({ ...prev, [regxElementName]: false }));
          showError(inputElement, "Month must be between 1 and 12.");
          return false;
      } else if (!day || day < 1 || day > 31) {
          setIsValid(prev => ({ ...prev, [regxElementName]: false }));
          showError(inputElement, "Enter a valid day.");
          return false;
      } else {
          setIsValid(prev => ({ ...prev, [regxElementName]: true }));
          showValid(inputElement);
          return true;
      }
  }
  else if (regxElementName === "contactEmail") {
    let newInputValue = elementValue.replace(/[^a-zA-Z0-9.@_]/g, "");

    if (!/^[a-zA-Z]/.test(newInputValue)) {
      showError(inputElement, "Email should start with an alphabet.");
      return false;
    } else if ((newInputValue.match(/@/g) || []).length > 1) {
      showError(inputElement, "Only one '@' symbol is allowed.");
      return false;
    } else if (newInputValue.includes("..")) {
      showError(inputElement, "Consecutive dots are not allowed.");
      return false;
    } else if (newInputValue.includes("__")) {
      showError(inputElement, "Consecutive underscores are not allowed.");
      return false;
    } else if (newInputValue.match(/@\./)) {
      showError(inputElement, "Dot cannot directly follow '@'.");
      return false;
    } else if (!/^[^\s@]+@[a-zA-Z]+(?:\.[a-zA-Z]{2,3}){1,2}$/.test(newInputValue)) {
      showError(inputElement, "Invalid email format.");
      return false;
    } else {
      setIsValid(prev => ({ ...prev, [regxElementName]: true }));
      showValid(inputElement);
      return true;
    }
  }


  return true;
};

  
  // Show error message and highlight input
  const showError = (inputElement, message) => {
    inputElement.style.borderColor = "red";
    let errorElement = inputElement.parentElement.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("span");
      errorElement.classList.add("error-message");
      inputElement.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
  };
  
  // Show input as valid
  const showValid = (inputElement) => {
    inputElement.style.borderColor = "green";
    let errorElement = inputElement.parentElement.querySelector(".error-message");
    if (errorElement) {
      errorElement.textContent = "";
    }
  };


export const clearValidation = () => {
    const inputElements = document.querySelectorAll('.input');
    inputElements.forEach(inputElement => {
      inputElement.style.borderColor = '';  
      let errorElement = inputElement.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.textContent = '';  
      }
    });
  };