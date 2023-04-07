import { getProductsById } from "./handler";
import { products as mockProducts } from "@mocks/products";
import { event as mockEventBody } from "@mocks/event";

const mockEvent = {
  ...mockEventBody,
  pathParameters: {
    productId: mockProducts[0].id,
  },
};

describe("Get product by id", function () {
  it("success", async () => {
    const result = await getProductsById(mockEvent);
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(mockProducts[0]);
  });

  it("not found", async () => {
    const result = await getProductsById({
      ...mockEvent,
      pathParameters: { productId: '500' },
    });
    expect(result.statusCode).toEqual(404);
    expect(JSON.parse(result.body)).toEqual({ error: "Product not found" });
  });
});
