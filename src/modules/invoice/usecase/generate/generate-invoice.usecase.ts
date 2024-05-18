import Address from "../../../@shared/domain/value-object/address";
import { InvoiceFactory } from "../../factorie/invoice.factory";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.dto";

export class GenerateInvoiceUseCase {
  constructor(private readonly _invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoice = InvoiceFactory.create({
      name: input.name,
      address: {
        city: input.city,
        complement: input.complement,
        number: input.number,
        state: input.state,
        street: input.street,
        zipCode: input.zipCode,
      },
      document: input.document,
      items: input.items.map((i) => ({
        name: i.name,
        price: i.price,
      })),
    });

    await this._invoiceRepository.save(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      city: invoice.address.city,
      complement: invoice.address.complement,
      number: invoice.address.number,
      state: invoice.address.state,
      street: invoice.address.street,
      zipCode: invoice.address.zipCode,
      document: invoice.document,
      total: invoice.items.reduce((acc, invItem) => acc + invItem.price, 0),
      items: invoice.items.map((i) => ({
        id: i.id.id,
        name: i.name,
        price: i.price,
      })),
    };
  }
}
