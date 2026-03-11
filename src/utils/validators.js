function validateAmount(amount) {
  return Number.isInteger(amount) && amount >= 1;
}

function validateCurrency(currency) {
  return typeof currency === "string" && currency.length === 3;
}

function validateEmail(email) {
  return (
    typeof email === "string" &&
    email.includes("@") &&
    email.includes(".")
  );
}

function generateId(prefix) {
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${random}`;
}

module.exports = {
  validateAmount,
  validateCurrency,
  validateEmail,
  generateId
};
