import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export class InvoiceRepository implements InvoiceGateway {
  async save(input: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      address: input.address,
      items: input.items,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipcode: input.address.zipCode,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
    for (const item of input.items) {
      await InvoiceItemModel.create({
        id: item.id.id,
        name: item.name,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        invoiceId: input.id.id,
      });
    }
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: {
        id,
      },
    });

    if (!invoice) {
      throw new Error(`Invoice wid id ${id} not found`);
    }

    const items = await InvoiceItemModel.findAll({
      where: {
        invoiceId: invoice.id,
      },
    });

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipcode
      ),
      document: invoice.document,
      items: items.map(
        (item) =>
          new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
}
