"use strict"
const test = require("node:test")
const assert = require("node:assert")
const { messages, render } = require("../src/messages")

test("every message is a non-empty string", () => {
    for (const [key, value] of Object.entries(messages)) {
        assert.ok(typeof value === "string" && value.length > 0, key)
    }
})

test("render fills placeholders", () => {
    assert.strictEqual(render("orderPlaced"), "Thanks! We received your order.")
})

test("orderShipped uses the current shipping message", () => {
    assert.strictEqual(render("orderShipped"), "Good news: your order is on its way.")
})

test("orderOutForDelivery uses the delivery-day message", () => {
    assert.strictEqual(render("orderOutForDelivery"), "Your order is out for delivery today.")
})

test("render rejects unknown keys", () => {
    assert.throws(() => render("nope"), /unknown message/)
})
