import { getCartCookie } from "../utils/cart.ts";
import type { AppContext } from "../mod.ts";
import { CheckoutSelectPaymentMethod } from "../utils/graphql/queries.ts";
import type {
  CheckoutSelectPaymentMethodMutation,
  CheckoutSelectPaymentMethodMutationVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import ensureCheckout from "../utils/ensureCheckout.ts";
import { WakeGraphqlError } from "../utils/error.ts";
import { badRequest } from "@deco/deco";

// https://wakecommerce.readme.io/docs/checkoutselectpaymentmethod
export default async function (
  props: Props,
  req: Request,
  ctx: AppContext,
) {
  const headers = parseHeaders(req.headers);
  try {
    const checkoutId = ensureCheckout(getCartCookie(req.headers));

    const { checkoutSelectPaymentMethod } = await ctx.storefront.query<
      CheckoutSelectPaymentMethodMutation,
      CheckoutSelectPaymentMethodMutationVariables
    >(
      {
        variables: {
          paymentMethodId: props.paymentMethodId,
          checkoutId,
        },
        ...CheckoutSelectPaymentMethod,
      },
      { headers },
    );

    return checkoutSelectPaymentMethod as CheckoutSelectPaymentMethodMutation[
      "checkoutSelectPaymentMethod"
    ];
  } catch (err) {
    if (Array.isArray(err)) {
      ctx.response.status = 400;
      return err as WakeGraphqlError[];
    }

    throw badRequest({
      message: String(err),
    });
  }
}

interface Props {
  paymentMethodId: string;
}
