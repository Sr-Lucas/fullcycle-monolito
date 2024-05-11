import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import Invoice from "../domain/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item";
import Address from "../../@shared/domain/value-object/address";
import { InvoiceRepository } from "./invoice.repository";

describe("InvoiceRepository test", () => {
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

  it("should generate a invoice", async () => {
    const invoiceItem1 = new InvoiceItem({
      id: new Id("11"),
      name: "Item 1",
      price: 300.3,
    });
    const invoiceItem2 = new InvoiceItem({
      id: new Id("21"),
      name: "Item 2",
      price: 300.3,
    });
    const invoice = new Invoice({
      id: new Id("1"),
      name: "invoice test name",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      document: "1233210981",
      items: [invoiceItem1, invoiceItem2],
    });

    const repository = new InvoiceRepository();
    await repository.save(invoice);

    const invoiceSaved = await InvoiceModel.findByPk(invoice.id.id);

    expect(invoiceSaved.id).toBe("1");
  });
});
