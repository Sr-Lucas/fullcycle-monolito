import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";

export type InvoiceFactoryInput = {
  id?: string;
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: {
    id?: string;
    name: string;
    price: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class InvoiceFactory {
  static create(input: InvoiceFactoryInput): Invoice {
    const items = input.items.map((item) => {
      return new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      });
    });

    return new Invoice({
      id: new Id(input.id),
      address: new Address(
        input.address.street,
        input.address.number,
        input.address.complement,
        input.address.city,
        input.address.state,
        input.address.zipCode
      ),
      document: input.document,
      items,
      name: input.name,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }
}
