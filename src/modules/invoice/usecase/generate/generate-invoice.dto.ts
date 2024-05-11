import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item";

export interface GenerateInvoiceInputDto {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
}

export interface GenerateInvoiceOutputDto {
  id: string;
  name: string;
  document: string;
  address: Address;
  items: { id: string; name: string; price: number }[];
  createdAt: Date;
  updatedAt: Date;
}
