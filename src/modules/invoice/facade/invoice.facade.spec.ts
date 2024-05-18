import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import { InvoiceFacadeFactory } from "../factory/invoice-facade.factory";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item";

describe("Testing Invoice Facade", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a new invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

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
    };

    const invoiceCreated = await facade.generate(input);

    const invoice = await InvoiceModel.findOne({
      where: { id: invoiceCreated.id },
      include: ["invoiceItems"],
    });

    expect(invoice).toBeDefined();
    expect(invoice.document).toBe(input.document);
    expect(invoice.name).toBe(input.name);
    expect(invoice.invoiceItems.length).toBe(2);
    expect(invoice.city).toBe(input.address.city);
    expect(invoice.complement).toBe(input.address.complement);
    expect(invoice.number).toBe(input.address.number);
    expect(invoice.street).toBe(input.address.street);
    expect(invoice.state).toBe(input.address.state);
    expect(invoice.zipcode).toBe(input.address.zipCode);
  });
});
