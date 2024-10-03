// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$$$$$$$0 from "./actions/cart/addItems.ts";
import * as $$$$$$$$$1 from "./actions/cart/updateCoupons.ts";
import * as $$$$$$$$$2 from "./actions/cart/updateItems.ts";
import * as $$$$$$$$$3 from "./actions/order/draftOrderCalculate.ts";
import * as $$$$$$$$$4 from "./actions/user/signIn.ts";
import * as $$$$0 from "./handlers/sitemap.ts";
import * as $$$4 from "./loaders/cart.ts";
import * as $$$0 from "./loaders/ProductDetailsPage.ts";
import * as $$$1 from "./loaders/ProductList.ts";
import * as $$$2 from "./loaders/ProductListingPage.ts";
import * as $$$5 from "./loaders/proxy.ts";
import * as $$$3 from "./loaders/RelatedProducts.ts";
import * as $$$6 from "./loaders/user.ts";

const manifest = {
  "loaders": {
    "shopify/loaders/cart.ts": $$$4,
    "shopify/loaders/ProductDetailsPage.ts": $$$0,
    "shopify/loaders/ProductList.ts": $$$1,
    "shopify/loaders/ProductListingPage.ts": $$$2,
    "shopify/loaders/proxy.ts": $$$5,
    "shopify/loaders/RelatedProducts.ts": $$$3,
    "shopify/loaders/user.ts": $$$6,
  },
  "handlers": {
    "shopify/handlers/sitemap.ts": $$$$0,
  },
  "actions": {
    "shopify/actions/cart/addItems.ts": $$$$$$$$$0,
    "shopify/actions/cart/updateCoupons.ts": $$$$$$$$$1,
    "shopify/actions/cart/updateItems.ts": $$$$$$$$$2,
    "shopify/actions/order/draftOrderCalculate.ts": $$$$$$$$$3,
    "shopify/actions/user/signIn.ts": $$$$$$$$$4,
  },
  "name": "shopify",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
