import Address from "../../@shared/domain/value-object/address";
import { FindInvoiceUseCase } from "../usecase/find/find-invoice.usecase";
import { GenerateInvoiceUseCase } from "../usecase/generate/generate-invoice.usecase";
import InvoiceFacadeInterface, {
  AddInvoiceFacadeInputDto,
  FindInvoiceFacadeInputDto,
  InvoiceFacadeOutputDto,
} from "./invoice-facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private readonly generateInvoiceUseCase: GenerateInvoiceUseCase,
    private readonly findInvoiceUseCase: FindInvoiceUseCase
  ) {}

  async generate(
    input: AddInvoiceFacadeInputDto
  ): Promise<InvoiceFacadeOutputDto> {
    const invoice = await this.generateInvoiceUseCase.execute({
      city: input.address.city,
      complement: input.address.complement,
      number: input.address.number,
      state: input.address.state,
      street: input.address.street,
      zipCode: input.address.zipCode,
      document: input.document,
      name: input.name,
      items: input.items.map((inputItem) => ({
        name: inputItem.name,
        price: inputItem.price,
        id: inputItem.id.id,
      })),
    });

    return {
      ...invoice,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode
      ),
    };
  }

  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<InvoiceFacadeOutputDto> {
    const invoice = await this.findInvoiceUseCase.execute(input);

    return {
      ...invoice,
      address: new Address(
        invoice.address.street,
        invoice.address.number,
        invoice.address.complement,
        invoice.address.city,
        invoice.address.state,
        invoice.address.zipCode
      ),
    };
  }
}
