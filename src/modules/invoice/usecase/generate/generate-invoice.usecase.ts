import Address from "../../../@shared/domain/value-object/address";
import { InvoiceFactory } from "../../factorie/invoice.factory";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceInputDto,
  GenerateInvoiceOutputDto,
} from "./generate-invoice.dto";

export class GenerateInvoiceUseCase {
  constructor(private readonly _invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceInputDto
  ): Promise<GenerateInvoiceOutputDto> {
    const invoice = InvoiceFactory.create({
      id: input.id.id,
      name: input.name,
      address: {
        city: input.address.city,
        complement: input.address.complement,
        number: input.address.number,
        state: input.address.state,
        street: input.address.street,
        zipCode: input.address.zipCode,
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
      updatedAt: invoice.updatedAt,
      createdAt: invoice.createdAt,
      address: new Address(
        invoice.address.street,
        invoice.address.number,
        invoice.address.complement,
        invoice.address.city,
        invoice.address.state,
        invoice.address.zipCode
      ),
      document: invoice.document,
      items: invoice.items.map((i) => ({
        id: i.id.id,
        name: i.name,
        price: i.price,
      })),
    };
  }
}
