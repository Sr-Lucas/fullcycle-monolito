import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item";

export interface FindInvoiceInputDto {
  id: string;
}

export interface FindInvoiceOutputDto {
  id: string;
  name: string;
  document: string;
  address: Address;
  items: { id: string; name: string; price: number }[];
  createdAt: Date;
  updatedAt: Date;
}
