const { computeTotal } = require("../src/checkout");

describe("Checkout total", () => {
  it("calculates subtotal without discount", () => {
    const items = [
      { name: "Widget", price: 25.0, quantity: 2 },
      { name: "Gadget", price: 15.5, quantity: 1 },
    ];
    const result = computeTotal(items);
    expect(result).toEqual({ subtotal: 65.5, discount: 0, total: 65.5 });
  });

  it("Checkout total with discount", () => {
    const items = [
      { name: "Widget", price: 49.99, quantity: 1 },
      { name: "Gadget", price: 50.0, quantity: 1 },
    ];
    const result = computeTotal(items, 10);
    expect(result).toEqual({ subtotal: 99.99, discount: 10.0, total: 89.99 });
  });

  it("applies 100% discount", () => {
    const items = [{ name: "Widget", price: 25.0, quantity: 1 }];
    const result = computeTotal(items, 100);
    expect(result).toEqual({ subtotal: 25.0, discount: 25.0, total: 0 });
  });

  it("handles empty cart", () => {
    const result = computeTotal([]);
    expect(result).toEqual({ subtotal: 0, discount: 0, total: 0 });
  });

  it("throws on invalid items argument", () => {
    expect(() => computeTotal(null)).toThrow(TypeError);
  });

  it("throws on out-of-range discount", () => {
    expect(() => computeTotal([], 150)).toThrow(RangeError);
    expect(() => computeTotal([], -5)).toThrow(RangeError);
  });
});
