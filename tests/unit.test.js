"use strict";
const chai = require("chai");
const mongoose = require("mongoose");
const chaiAsPromised = require("chai-as-promised");
const expect = require("chai").expect;
const should = require("chai").should();
chai.use(chaiAsPromised).should();

require("../config/connection");
const { commander, masterPerUrl } = require("../svc");
const { gateway } = require("../svc/gateway");
const { body, body1 } = require("./data");

beforeEach(async () => {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error"));
  db.once("open", () => {
    console.log("test DB connected!");
  });
});

const defaultTimeout = 20 * 1000;

describe("TEST: .... ||", () => {
  it("test per source", async () => {
    const validation = gateway(body, "body");
    expect(validation).to.be.true;
    const responses = await commander(body);
    // console.log({responses})
    expect(responses).to.be.an("array");
    // expect(responses.length).to.equal(body.links.length)
  }).timeout(defaultTimeout);

  it("test per url", async () => {
    const url =
      "https://www.theatlantic.com/international/archive/2020/01/prince-harry-meghan-markle-hypocrisy-royals/604714/";
    const response = await masterPerUrl(url);
    expect(response).to.have.nested.property("extract");
    expect(response).to.have.nested.property("links");
    // expect(response).to.have.nested.property('content_url')
    expect(response).to.have.nested.property("core");
    expect(response).to.have.nested.property("word_arrays");
    expect(response).to.have.nested.property("authors");
    expect(response).to.have.nested.property("analysis");
  }).timeout(defaultTimeout);
});
