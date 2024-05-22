import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceItem from "../../../invoice/domain/invoice-item";
import InvoiceFacade from "../../../invoice/facade/invoice.facade";
import PaymentFacade from "../../../payment/facade/payment.facade";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  constructor(
    private readonly _clientFacade: ClientAdmFacadeInterface,
    private readonly _productFacade: ProductAdmFacadeInterface,
    private readonly _catalogFacade: StoreCatalogFacadeInterface,
    private readonly _invoiceFacade: InvoiceFacade,
    private readonly _paymentFacade: PaymentFacade,
    private readonly _repository: CheckoutGateway
  ) {}

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({
      id: input.clientId,
    });
    if (!client) {
      throw new Error("Client not found");
    }

    await this.validateProducts(input);
    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    const myClient = new Client({
      id: new Id(client.id),
      email: client.email,
      name: client.name,
      address: client.address,
    });
    const order = new Order({
      client: myClient,
      products,
    });

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    const invoice =
      payment.status === "approved"
        ? await this._invoiceFacade.generate({
            name: client.name,
            document: client.document,
            address: client.address,
            items: products.map((p) => {
              return new InvoiceItem({
                id: p.id,
                name: p.name,
                price: p.salesPrice,
              });
            }),
          })
        : null;

    if (payment.status === "approved") {
      order.approve();
    }

    await this._repository.addOrder(order);

    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      products: order.products.map((p) => ({ productId: p.id.id })),
      total: order.total,
      status: order.status,
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(id: string): Promise<Product> {
    const product = await this._catalogFacade.find({
      id,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return new Product({
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
      id: new Id(product.id),
    });
  }
}
