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
      items,
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      name: "Invoice teste",
      id: new Id("1"),
    };

    const result = await usecase.execute(input);

    expect(result).toBeDefined();
    expect(result.id).toBe(input.id.id);
    expect(result.document).toBe(input.document);
    expect(result.name).toBe(input.name);
    expect(result.items.length).toBe(2);
    expect(result.address.city).toBe(input.address.city);
    expect(result.address.complement).toBe(input.address.complement);
    expect(result.address.number).toBe(input.address.number);
    expect(result.address.street).toBe(input.address.street);
    expect(result.address.state).toBe(input.address.state);
    expect(result.address.zipCode).toBe(input.address.zipCode);
  });
});
