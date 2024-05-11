import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
  save(input: Invoice): Promise<void>;
  find(id: string): Promise<Invoice>;
}
