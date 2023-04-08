import { getProductsList } from "./handler";
import { products as mockProducts } from "@mocks/products";
import { event as mockEvent } from '@mocks/event';

describe("Get products list", function () {
  it("success", async () => {
    const result = await getProductsList(mockEvent);
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(mockProducts);
  });
});
