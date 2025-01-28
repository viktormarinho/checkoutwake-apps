import { getCookies, setCookie } from "std/http/cookie.ts";
import type { AppContext } from "../mod.ts";
import { getUserCookie, setUserCookie } from "../utils/user.ts";
import type {
  CustomerAccessTokenRenewMutation,
  CustomerAccessTokenRenewMutationVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { CustomerAccessTokenRenew } from "../utils/graphql/queries.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";
import { getClientCookie } from "./cart.ts";

const authenticate = async (
  req: Request,
  ctx: AppContext,
): Promise<string | null> => {
  const { checkoutApi, headlessCheckout } = ctx;
  const currentTime = new Date().getTime();
  const cookies = getCookies(req.headers);
  const customerToken = cookies.customerToken;
  const lastTokenRenewTime = cookies.lastTokenRenewTime;

  console.log("LOG: lastTokenRenewTime", lastTokenRenewTime);

  if (lastTokenRenewTime) {
    const timeDifference = currentTime - parseInt(lastTokenRenewTime);
    if (timeDifference < 1000 * 60 * 60 * 24) {
      console.log("Não precisa renovar token");
      return customerToken;
    }
  }

  if (headlessCheckout) {
    const headers = parseHeaders(req.headers);

    if (!customerToken) return null;

    const { customerAccessTokenRenew } = await ctx.storefront.query<
      CustomerAccessTokenRenewMutation,
      CustomerAccessTokenRenewMutationVariables
    >(
      {
        variables: { customerAccessToken: customerToken },
        ...CustomerAccessTokenRenew,
      },
      { headers },
    );

    if (!customerAccessTokenRenew) return null;

    const newCustomerToken = customerAccessTokenRenew.token;

    if (!newCustomerToken) return null;

    setUserCookie(
      ctx.response.headers,
      newCustomerToken,
      cookies["fbits-login"],
      new Date(customerAccessTokenRenew.validUntil),
    );

    setCookie(ctx.response.headers, {
      name: "lastTokenRenewTime",
      value: currentTime.toString(),
    });

    return newCustomerToken;
  }

  const loginCookie = getUserCookie(req.headers);

  if (!loginCookie) return null;

  if (headlessCheckout) return loginCookie;

  const data = await checkoutApi["GET /api/Login/Get"](
    {},
    {
      headers: req.headers,
    },
  ).then((r) => r.json());
  if (!data?.CustomerAccessToken) return null;

  return data?.CustomerAccessToken;
};

export default authenticate;
