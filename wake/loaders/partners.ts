import { RequestURLParam } from "../../website/functions/requestToParam.ts";
import type { AppContext } from "../mod.ts";
import { GetPartners } from "../utils/graphql/queries.ts";
import {
  GetPartnersQuery,
  GetPartnersQueryVariables,
} from "../utils/graphql/storefront.graphql.gen.ts";
import { parseHeaders } from "../utils/parseHeaders.ts";

export interface Props {
  slug?: RequestURLParam;
  /**
   * @ignore
   */
  first?: number;
  /**
   * @ignore
   */
  alias?: string[];
}

/**
 * @title Wake Integration - Partners
 * @description Partners loader
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<GetPartnersQuery["partners"]> => {
  const { storefront } = ctx;
  const { slug, first, alias } = props;

  const headers = parseHeaders(req.headers);

  const currentAlias = alias ? alias : (slug ? [slug] : []);

  const data = await storefront.query<
    GetPartnersQuery,
    GetPartnersQueryVariables
  >(
    {
      variables: { first: first ?? 1, alias: currentAlias },
      ...GetPartners,
    },
    { headers },
  );

  return data.partners ?? undefined;
};

export default loader;
