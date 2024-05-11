import InvoiceFacadeInterface from "../facade/invoice-facade.interface";
import InvoiceFacade from "../facade/invoice.facade";
import { InvoiceRepository } from "../repository/invoice.repository";
import { FindInvoiceUseCase } from "../usecase/find/find-invoice.usecase";
import { GenerateInvoiceUseCase } from "../usecase/generate/generate-invoice.usecase";

export class InvoiceFacadeFactory {
  static create(): InvoiceFacadeInterface {
    const repository = new InvoiceRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
    const findeInvoiceUseCase = new FindInvoiceUseCase(repository);
    const facade = new InvoiceFacade(
      generateInvoiceUseCase,
      findeInvoiceUseCase
    );

    return facade;
  }
}
