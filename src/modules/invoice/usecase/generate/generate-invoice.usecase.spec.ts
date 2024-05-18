import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item";

import { GenerateInvoiceUseCase } from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn(),
  };
};

describe("GenerateInvoiceUseCase tests", () => {
  it("Should generate an invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    const items: InvoiceItem[] = [];

    items.push(
      new InvoiceItem({
        name: "Teste item 1",
        price: 123.92,
      })
    );

    items.push(
      new InvoiceItem({
        name: "Teste item 2",
        price: 145.85,
      })
    );

    const input = {
      name: "Invoice teste",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: items.map((invItem) => ({
        name: invItem.name,
        price: invItem.price,
        id: invItem.id.id,
      })),
    };

    const result = await usecase.execute(input);

    expect(result).toBeDefined();
    expect(result.document).toBe(input.document);
    expect(result.name).toBe(input.name);
    expect(result.items.length).toBe(2);
    expect(result.city).toBe(input.city);
    expect(result.complement).toBe(input.complement);
    expect(result.number).toBe(input.number);
    expect(result.street).toBe(input.street);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
  });
});
