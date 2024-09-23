import { lazyLoad } from "./lazy-load";

describe("lazyLoad", () => {
  let initializeCount = 0;
  const expectedResponse =
    "im expensive. if you can't handle me at my worst, you don't deserve me at my best";
  const getValue = () => {
    initializeCount++;
    return expectedResponse;
  };
  const lazyLoaded = lazyLoad(getValue);

  it("should initialize on first retrieval", () => {
    expect(lazyLoaded()).toBe(expectedResponse);
    expect(initializeCount).toBe(1);
  });

  it("should re-use upon subsequent retrievals", () => {
    expect(lazyLoaded()).toBe(expectedResponse);
    expect(initializeCount).toBe(1);

    expect(lazyLoaded()).toBe(expectedResponse);
    expect(initializeCount).toBe(1);
  });
});
