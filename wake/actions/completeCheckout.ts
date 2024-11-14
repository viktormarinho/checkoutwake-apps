import { deleteCookie, setCookie } from "std/http/cookie.ts";
import type { AppContext } from "../mod.ts";
import authenticate from "../utils/authenticate.ts";
import { CART_COOKIE, getCartCookie } from "../utils/cart.ts";
import ensureCheckout from "../utils/ensureCheckout.ts";
import ensureCustomerToken from "../utils/ensureCustomerToken.ts";
import { CheckoutComplete } from "../utils/graphql/queries.ts";
import type {
  CheckoutCompleteMutation,
  CheckoutCompleteMutationVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import { badRequest } from "@deco/deco";
import { WakeGraphqlError } from "../utils/error.ts";

// https://wakecommerce.readme.io/docs/checkoutcomplete
export default async function (props: Props, req: Request, ctx: AppContext) {
  const headers = parseHeaders(req.headers);
  const customerAccessToken = ensureCustomerToken(await authenticate(req, ctx));
  const checkoutId = ensureCheckout(getCartCookie(req.headers));

  console.log({
    variables: {
      paymentData: new URLSearchParams(props.paymentData).toString(),
      comments: props.comments,
      customerAccessToken,
      checkoutId,
    },
  });

  try {
    const { checkoutComplete } = await ctx.storefront.query<
      CheckoutCompleteMutation,
      CheckoutCompleteMutationVariables
    >(
      {
        variables: {
          paymentData: new URLSearchParams(props.paymentData).toString(),
          comments: props.comments,
          customerAccessToken,
          checkoutId,
        },
        ...CheckoutComplete,
      },
      { headers },
    );

    deleteCookie(ctx.response.headers, CART_COOKIE, { path: "/" });
    return checkoutComplete;
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
  /**
   * Informações adicionais de pagamento
   */
  paymentData?: Record<string, string>;
  /**
   * Comentários
   */
  comments?: string;
}
