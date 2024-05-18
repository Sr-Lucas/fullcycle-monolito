import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item";

export interface AddInvoiceFacadeInputDto {
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
}

export interface FindInvoiceFacadeInputDto {
  id: string;
}

export interface InvoiceFacadeOutputDto {
  id: string;
  name: string;
  document: string;
  address: Address;
  total: number;
  items: { id: string; name: string; price: number }[];
}

export default interface InvoiceFacadeInterface {
  generate(input: AddInvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto>;
  find(input: FindInvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto>;
}
