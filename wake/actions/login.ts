import type { AppContext } from "../mod.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import type {
  CheckoutCustomerAssociateMutation,
  CheckoutCustomerAssociateMutationVariables,
  CustomerAuthenticatedLoginMutation,
  CustomerAuthenticatedLoginMutationVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import {
  CheckoutCustomerAssociate,
  CustomerAuthenticatedLogin,
} from "../utils/graphql/queries.ts";
import { setCookie } from "std/http/cookie.ts";
import { getCartCookie } from "apps/wake/utils/cart.ts";
import { setUserCookie } from "apps/wake/utils/user.ts";

export default async function (
  props: Props,
  req: Request,
  { storefront, response }: AppContext,
): Promise<CustomerAuthenticatedLoginMutation["customerAuthenticatedLogin"]> {
  const headers = parseHeaders(req.headers);

  const { customerAuthenticatedLogin } = await storefront.query<
    CustomerAuthenticatedLoginMutation,
    CustomerAuthenticatedLoginMutationVariables
  >({ variables: props, ...CustomerAuthenticatedLogin }, { headers });

  if (customerAuthenticatedLogin) {
    setUserCookie(
      response.headers,
      customerAuthenticatedLogin.token as string,
      new Date(customerAuthenticatedLogin.validUntil),
    );

    // associate account to checkout
    await storefront.query<
      CheckoutCustomerAssociateMutation,
      CheckoutCustomerAssociateMutationVariables
    >(
      {
        variables: {
          customerAccessToken: customerAuthenticatedLogin.token as string,
          checkoutId: getCartCookie(req.headers),
        },
        ...CheckoutCustomerAssociate,
      },
      { headers },
    );
  }

  return customerAuthenticatedLogin;
}

export interface Props {
  /**
   * Email
   */
  input: string;
  /**
   * Senha
   */
  pass: string;
}