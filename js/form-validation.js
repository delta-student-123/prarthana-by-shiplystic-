/* ==========================================================================
   Shiplystic Prarthana - Form Validation Helper (js/form-validation.js)
   ========================================================================== */

const FormValidator = {
  validatePhone: function(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10;
  },

  validateEmail: function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  validatePincode: function(pincode) {
    return /^\d{6}$/.test(pincode.trim());
  },

  validateDevoteeForm: function(formData) {
    const errors = [];

    if (!formData.devoteeName || formData.devoteeName.trim().length < 2) {
      errors.push("Please enter a valid Primary Devotee Name.");
    }

    if (!formData.gotra || formData.gotra.trim().length < 2) {
      errors.push("Please enter your Gotra (or enter 'Kashyap' if unknown).");
    }

    if (!formData.phone || !this.validatePhone(formData.phone)) {
      errors.push("Please enter a valid 10-digit Mobile Number for WhatsApp updates.");
    }

    if (!formData.email || !this.validateEmail(formData.email)) {
      errors.push("Please enter a valid Email Address for tracking receipts.");
    }

    if (!formData.address || formData.address.trim().length < 10) {
      errors.push("Please enter your complete delivery street address.");
    }

    if (!formData.pincode || !this.validatePincode(formData.pincode)) {
      errors.push("Please enter a valid 6-digit Indian Pincode.");
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
};
