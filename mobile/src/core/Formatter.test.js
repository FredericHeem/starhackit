import { assert } from "chai";
import Formatter from "./Formatter";

describe("Formatter", function() {
  let formatter;
  const EUR100 = {
    value: "100.1",
    currency: "EUR"
  };
  const locales = ["en-GB", "fr-FR", "it-IT"];
  it("dateTime all", () => {
    const date = new Date();
    locales.forEach(locale => {
      const formatter = Formatter(locale);
      console.log(formatter.dateTime(date));
      assert(formatter.dateTime(date));
    });
  });
  it("money all", () => {
    locales.forEach(locale => {
      const formatter = Formatter(locale);
      console.log(formatter.money1(EUR100));
      assert(formatter.money(EUR100));
    });
  });
  describe("en", function() {
    beforeEach(function() {
      formatter = Formatter("en-GB");
    });
    it("money", () => {
      console.log(formatter.money1(EUR100));
      assert(formatter.money(EUR100));
      formatter.setLocale("ru-RU");
      console.log(formatter.money1(EUR100));
    });
    it("dateTime", () => {
      const date = new Date();
      console.log(formatter.dateTime(date));
      assert(formatter.dateTime(date));
      formatter.setLocale("fr-FR");
      console.log(formatter.dateTime(date));
      assert(formatter.dateTime(date));
    });
  });
});
