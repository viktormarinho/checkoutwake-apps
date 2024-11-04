import { badRequest } from "@deco/deco";
import type { AppContext } from "../mod.ts";
import { getCartCookie } from "../utils/cart.ts";
import {
  CheckoutCustomerAssociate,
  CustomerAuthenticatedLogin,
} from "../utils/graphql/queries.ts";
import type {
  CheckoutCustomerAssociateMutation,
  CheckoutCustomerAssociateMutationVariables,
  CustomerAuthenticatedLoginMutation,
  CustomerAuthenticatedLoginMutationVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import { setUserCookie } from "../utils/user.ts";
import { WakeGraphqlError } from "../utils/error.ts";

export default async function (
  props: Props,
  req: Request,
  { storefront, response, invoke }: AppContext,
) {
  const headers = parseHeaders(req.headers);
  try {
    const { customerAuthenticatedLogin } = await storefront.query<
      CustomerAuthenticatedLoginMutation,
      CustomerAuthenticatedLoginMutationVariables
    >({ variables: props, ...CustomerAuthenticatedLogin }, { headers });

    if (customerAuthenticatedLogin) {
      setUserCookie(
        response.headers,
        customerAuthenticatedLogin.token as string,
        customerAuthenticatedLogin.legacyToken as string,
        new Date(customerAuthenticatedLogin.validUntil),
      );
    }

    return customerAuthenticatedLogin as CustomerAuthenticatedLoginMutation["customerAuthenticatedLogin"];
  } catch (err) {
    if (Array.isArray(err)) {
      response.status = 400;
      return err as WakeGraphqlError[];
    }
    
    throw badRequest({
      message: String(err),
    });
  }
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
