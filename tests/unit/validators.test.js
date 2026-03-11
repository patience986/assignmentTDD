const {
  validateAmount,
  validateCurrency,
  validateEmail,
  generateId
} = require('../../src/utils/validators');

describe("validateAmount", () => {

  test("returns true for 100", () => {
    expect(validateAmount(100)).toBe(true);
  });

  test("returns true for 1 (minimum boundary)", () => {
    expect(validateAmount(1)).toBe(true);
  });

  test("returns false for 0", () => {
    expect(validateAmount(0)).toBe(false);
  });

  test("returns false for -1", () => {
    expect(validateAmount(-1)).toBe(false);
  });

  test("returns false for decimal 9.99", () => {
    expect(validateAmount(9.99)).toBe(false);
  });

  test("returns false for null", () => {
    expect(validateAmount(null)).toBe(false);
  });

  test("returns false for string '100'", () => {
    expect(validateAmount("100")).toBe(false);
  });

});

describe("validateCurrency", () => {

  test("returns true for 'usd'", () => {
    expect(validateCurrency("usd")).toBe(true);
  });

  test("returns false for 'us' (too short)", () => {
    expect(validateCurrency("us")).toBe(false);
  });

  test("returns false for 'usdd' (too long)", () => {
    expect(validateCurrency("usdd")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(validateCurrency("")).toBe(false);
  });

});

describe("validateEmail", () => {

  test("returns true for alice@example.com", () => {
    expect(validateEmail("alice@example.com")).toBe(true);
  });

  test("returns false for string without @", () => {
    expect(validateEmail("aliceexample.com")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(validateEmail("")).toBe(false);
  });

});

describe("generateId", () => {

  test("returns string starting with prefix", () => {
    const id = generateId("pay");
    expect(id.startsWith("pay_")).toBe(true);
  });

  test("returns different value each time", () => {
    const id1 = generateId("pay");
    const id2 = generateId("pay");

    expect(id1).not.toBe(id2);
  });

});