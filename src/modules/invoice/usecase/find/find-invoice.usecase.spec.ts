import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item";
import { FindInvoiceUseCase } from "./find-invoice.usecase";

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

const invoice = {
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

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("FindInvoiceUseCase tests", () => {
  it("Should return a invoice by id", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const result = await usecase.execute({
      id: "1",
    });

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.id).toBe(invoice.id.id);
    expect(result.document).toBe(invoice.document);
    expect(result.name).toBe(invoice.name);
    expect(result.items.length).toBe(2);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.total).toBe(
      invoice.items.reduce((acc, invItem) => acc + invItem.price, 0)
    );
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
  });
});
