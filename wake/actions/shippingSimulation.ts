import type { AppContext } from "../mod.ts";
import { ShippingQuotes } from "../utils/graphql/queries.ts";
import type {
  ShippingQuotesQuery,
  ShippingQuotesQueryVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { getCartCookie } from "../utils/cart.ts";
import { HttpError } from "../../utils/http.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import ensureCheckout from "../utils/ensureCheckout.ts";
import { WakeGraphqlError } from "../utils/error.ts";
import { badRequest } from "@deco/deco";

interface ProductItem {
  productVariantId: number;
  quantity: number;
}

export interface Props {
  cep?: string;
  simulateCartItems?: boolean;
  productVariantId?: number;
  quantity?: number;
  useSelectedAddress?: boolean;
  products?: ProductItem[];
}

export const buildSimulationParams = (
  props: Props,
  checkoutId?: string,
): ShippingQuotesQueryVariables => {
  const {
    cep,
    simulateCartItems,
    productVariantId,
    quantity,
    useSelectedAddress,
    products,
  } = props;

  const defaultQueryParams = {
    cep,
    useSelectedAddress,
  };

  if (products?.length) {
    return {
      ...defaultQueryParams,
      products,
    };
  }

  if (simulateCartItems) {
    if (!checkoutId) throw new HttpError(400, "Missing cart cookie");

    return {
      ...defaultQueryParams,
      checkoutId,
    };
  }

  return {
    ...defaultQueryParams,
    productVariantId,
    quantity,
  };
};

const action = async (
  props: Props,
  req: Request,
  ctx: AppContext,
) => {
  const { storefront } = ctx;

  const headers = parseHeaders(req.headers);
  const cartId = ensureCheckout(getCartCookie(req.headers));
  const simulationParams = buildSimulationParams(props, cartId);

  try {
    const data = await storefront.query<
      ShippingQuotesQuery,
      ShippingQuotesQueryVariables
    >(
      {
        variables: {
          ...simulationParams,
        },
        ...ShippingQuotes,
      },
      {
        headers,
      },
    );

    return (data.shippingQuotes ?? []) as ShippingQuotesQuery["shippingQuotes"];
  } catch (err) {
    if (Array.isArray(err)) {
      ctx.response.status = 400;
      return err as WakeGraphqlError[];
    }

    throw badRequest({
      message: String(err),
    });
  }
};

export default action;
