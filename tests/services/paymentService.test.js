const PaymentService = require('../../src/services/paymentService');

describe("PaymentService", () => {

  let repo;
  let service;

  beforeEach(() => {

    repo = {
      saveCustomer: jest.fn(),
      findCustomerByEmail: jest.fn(),
      findCustomerById: jest.fn(),

      savePayment: jest.fn(),
      findPaymentById: jest.fn(),
      findPaymentsByCustomer: jest.fn(),

      saveRefund: jest.fn(),
      findRefundsByPayment: jest.fn()
    };

    service = new PaymentService(repo);

  });

  // -----------------------
  // CUSTOMER TESTS
  // -----------------------

  test("createCustomer returns customer with correct name and email", async () => {

    repo.findCustomerByEmail.mockResolvedValue(null);
    repo.saveCustomer.mockImplementation(c => Promise.resolve(c));

    const result = await service.createCustomer("Alice","alice@example.com");

    expect(result.name).toBe("Alice");
    expect(result.email).toBe("alice@example.com");

  });

  test("createCustomer generates id prefixed with cus_", async () => {

    repo.findCustomerByEmail.mockResolvedValue(null);
    repo.saveCustomer.mockImplementation(c => Promise.resolve(c));

    const result = await service.createCustomer("Alice","alice@example.com");

    expect(result.id.startsWith("cus_")).toBe(true);

  });

  test("createCustomer throws when name empty", async () => {

    await expect(
      service.createCustomer("", "alice@example.com")
    ).rejects.toThrow("Name is required");

  });

  test("createCustomer throws invalid email", async () => {

    await expect(
      service.createCustomer("Alice","aliceexample.com")
    ).rejects.toThrow("Invalid email");

  });

  test("createCustomer throws when email already exists", async () => {

    repo.findCustomerByEmail.mockResolvedValue({id:"cus_1"});

    await expect(
      service.createCustomer("Alice","alice@example.com")
    ).rejects.toThrow("Email already exists");

  });

  // -----------------------
  // PAYMENT TESTS
  // -----------------------

  test("createPayment returns payment with status pending", async () => {

    repo.findCustomerById.mockResolvedValue({id:"cus_1"});
    repo.savePayment.mockImplementation(p => Promise.resolve(p));

    const result = await service.createPayment("cus_1",1000,"usd");

    expect(result.status).toBe("pending");

  });

  test("createPayment generates id prefixed with pay_", async () => {

    repo.findCustomerById.mockResolvedValue({id:"cus_1"});
    repo.savePayment.mockImplementation(p => Promise.resolve(p));

    const result = await service.createPayment("cus_1",1000,"usd");

    expect(result.id.startsWith("pay_")).toBe(true);

  });

  test("createPayment throws when customer not found", async () => {

    repo.findCustomerById.mockResolvedValue(null);

    await expect(
      service.createPayment("cus_9",1000,"usd")
    ).rejects.toThrow("Customer not found");

  });

  test("createPayment throws invalid amount when 0", async () => {

    repo.findCustomerById.mockResolvedValue({id:"cus_1"});

    await expect(
      service.createPayment("cus_1",0,"usd")
    ).rejects.toThrow("Invalid amount");

  });

  test("createPayment throws invalid amount when negative", async () => {

    repo.findCustomerById.mockResolvedValue({id:"cus_1"});

    await expect(
      service.createPayment("cus_1",-10,"usd")
    ).rejects.toThrow("Invalid amount");

  });

  test("createPayment throws invalid amount when decimal", async () => {

    repo.findCustomerById.mockResolvedValue({id:"cus_1"});

    await expect(
      service.createPayment("cus_1",9.99,"usd")
    ).rejects.toThrow("Invalid amount");

  });

  test("createPayment throws invalid currency", async () => {

    repo.findCustomerById.mockResolvedValue({id:"cus_1"});

    await expect(
      service.createPayment("cus_1",1000,"us")
    ).rejects.toThrow("Invalid currency");

  });

  // -----------------------
  // CAPTURE TESTS
  // -----------------------

  test("capture changes status from pending to succeeded", async () => {

    repo.findPaymentById.mockResolvedValue({
      id:"pay_1",
      status:"pending"
    });

    repo.savePayment.mockImplementation(p => Promise.resolve(p));

    const result = await service.capture("pay_1");

    expect(result.status).toBe("succeeded");

  });

  test("capture throws payment not found", async () => {

    repo.findPaymentById.mockResolvedValue(null);

    await expect(
      service.capture("pay_9")
    ).rejects.toThrow("Payment not found");

  });

  test("capture throws cannot capture if already succeeded", async () => {

    repo.findPaymentById.mockResolvedValue({
      id:"pay_1",
      status:"succeeded"
    });

    await expect(
      service.capture("pay_1")
    ).rejects.toThrow("Cannot capture");

  });

  test("capture throws cannot capture if failed", async () => {

    repo.findPaymentById.mockResolvedValue({
      id:"pay_1",
      status:"failed"
    });

    await expect(
      service.capture("pay_1")
    ).rejects.toThrow("Cannot capture");

  });

});