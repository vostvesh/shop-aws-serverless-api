import { getProductsList } from "./handler";
import { products as mockProducts } from "@mocks/products";

describe("Get products list", function () {
  it("success", async () => {
    const result = await getProductsList();
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(mockProducts);
  });
});
