const {
  validateAmount,
  validateCurrency,
  validateEmail,
  generateId
} = require("../utils/validators");

class PaymentService {

  constructor(repo) {
    this.repo = repo;
  }

  // --------------------
  // CREATE CUSTOMER
  // --------------------

  async createCustomer(name, email) {

    if (!name) {
      throw new Error("Name is required");
    }

    if (!validateEmail(email)) {
      throw new Error("Invalid email");
    }

    const existing = await this.repo.findCustomerByEmail(email);

    if (existing) {
      throw new Error("Email already exists");
    }

    const customer = {
      id: generateId("cus"),
      name,
      email
    };

    return this.repo.saveCustomer(customer);
  }

  // --------------------
  // CREATE PAYMENT
  // --------------------

  async createPayment(customerId, amount, currency) {

    const customer = await this.repo.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (!validateAmount(amount)) {
      throw new Error("Invalid amount");
    }

    if (!validateCurrency(currency)) {
      throw new Error("Invalid currency");
    }

    const payment = {
      id: generateId("pay"),
      customerId,
      amount,
      currency,
      status: "pending"
    };

    return this.repo.savePayment(payment);
  }

  // --------------------
  // CAPTURE PAYMENT
  // --------------------

  async capture(paymentId) {

    const payment = await this.repo.findPaymentById(paymentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "pending") {
      throw new Error("Cannot capture");
    }

    payment.status = "succeeded";

    return this.repo.savePayment(payment);
  }

}

module.exports = PaymentService;