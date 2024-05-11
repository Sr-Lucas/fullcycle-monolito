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
    return this.generateInvoiceUseCase.execute(input);
  }

  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<InvoiceFacadeOutputDto> {
    return this.findInvoiceUseCase.execute(input);
  }
}
