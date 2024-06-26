import { number } from "yup";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUseCase unit test", () => {
  describe("execute method", () => {
    const mockClientFacade = {
      add: jest.fn().mockResolvedValue(null),
      find: jest.fn().mockResolvedValue(null),
    };

    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };
      const spyOnFind = jest.spyOn(mockClientFacade, "find");

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();

      //@ts-expect-error - no attribution to read-only attributes
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );

      expect(spyOnFind).toHaveBeenCalled();
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };
      mockClientFacade.find = jest.fn().mockResolvedValue(true);

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();

      //@ts-expect-error - no attribution to read-only attributes
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const mockValidateProducts = jest
        //@ts-expect-error
        .spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );

      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set _productFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          description: "Product 1 description",
          name: "Product 1",
          salesPrice: 0,
        }),
      };

      //@ts-expect-error - force set _productFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("0"),
          description: "Product 1 description",
          name: "Product 1",
          salesPrice: 0,
        })
      );
      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("validateProducts method", () => {
    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error if products has invalid value", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrowError(new Error("No products selected"));
    });

    it("should throw an erro when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) => {
          return Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          });
        }),
      };

      //@ts-expect-error - force set _productFacade
      placeOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      input = {
        clientId: "0",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(2);
    });
  });

  describe("place an order", () => {
    const clientProps = {
      id: "1c",
      name: "Client 0",
      document: "0000",
      email: "client@user.com",
      number: "1",
      complement: "complement",
      street: "street",
      city: "some city",
      state: "some state",
      zipCode: "000",
    };

    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(clientProps),
    };

    const mockPaymentFacade = {
      process: jest.fn(),
    };

    const mockCheckoutRepo = {
      addOrder: jest.fn(),
    };

    const mockInvoiceFacade = {
      generate: jest.fn().mockResolvedValue({ id: "1i" }),
    };

    const placeOrderUseCase = new PlaceOrderUseCase(
      mockClientFacade as any,
      null,
      null,
      mockInvoiceFacade as any,
      mockPaymentFacade as any,
      mockCheckoutRepo as any
    );

    const products = {
      "1": new Product({
        id: new Id("1"),
        description: "some description",
        name: "Product 1",
        salesPrice: 40,
      }),
      "2": new Product({
        id: new Id("2"),
        name: "Product 2",
        description: "some description",
        salesPrice: 30,
      }),
    };

    const mockGetProduct = jest
      //@ts-expect-error - private method
      .spyOn(placeOrderUseCase, "getProduct")
      //@ts-expect-error - not return never
      .mockImplementation((productId: keyof typeof products) => {
        return products[productId];
      });

    const mockValidateProducts = jest
      //@ts-expect-error - private method
      .spyOn(placeOrderUseCase, "validateProducts")
      //@ts-expect-error - not return never
      .mockResolvedValue(true);

    it("should not be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "error",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      let output = await placeOrderUseCase.execute(input);

      expect(output.invoiceId).toBe(null);
      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toBeCalledWith({ id: "1c" });
      expect(mockValidateProducts).toBeCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toBeCalledTimes(2);
      expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toBeCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
    });

    it("should be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      let output = await placeOrderUseCase.execute(input);

      expect(output.invoiceId).toBe("1i");
      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toBeCalledWith({ id: "1c" });
      expect(mockValidateProducts).toBeCalledTimes(1);
      expect(mockGetProduct).toBeCalledTimes(2);
      expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toBeCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
    });
  });
});
