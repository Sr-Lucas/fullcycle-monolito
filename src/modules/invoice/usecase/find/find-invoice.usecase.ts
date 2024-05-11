import Address from "../../../@shared/domain/value-object/address";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceInputDto, FindInvoiceOutputDto } from "./find-invoice.dto";

export class FindInvoiceUseCase {
  constructor(private readonly _invoiceRepository: InvoiceGateway) {}

  async execute({ id }: FindInvoiceInputDto): Promise<FindInvoiceOutputDto> {
    const invoice = await this._invoiceRepository.find(id);

    return {
      id: invoice.id.id,
      document: invoice.document,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      name: invoice.name,
      address: new Address(
        invoice.address.street,
        invoice.address.number,
        invoice.address.complement,
        invoice.address.city,
        invoice.address.state,
        invoice.address.zipCode
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
  }
}
