// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$0 from "./loaders/productList.ts";
import * as $$$1 from "./loaders/productDetailsPage.ts";
import * as $$$2 from "./loaders/productDetailsPageVideo.ts";
import * as $$$3 from "./loaders/productListingPage.ts";
import * as $$$4 from "./loaders/proxy.ts";
import * as $$$5 from "./loaders/cart.ts";
import * as $$$$$$$$$0 from "./actions/cart/updateItem.ts";
import * as $$$$$$$$$1 from "./actions/cart/updateCart.ts";
import * as $$$$$$$$$2 from "./actions/cart/addItem.ts";
import * as $$$$$$$$$3 from "./actions/cart/simulation.ts";

const manifest = {
  "loaders": {
    "vnda/loaders/cart.ts": $$$5,
    "vnda/loaders/productDetailsPage.ts": $$$1,
    "vnda/loaders/productDetailsPageVideo.ts": $$$2,
    "vnda/loaders/productList.ts": $$$0,
    "vnda/loaders/productListingPage.ts": $$$3,
    "vnda/loaders/proxy.ts": $$$4,
  },
  "actions": {
    "vnda/actions/cart/addItem.ts": $$$$$$$$$2,
    "vnda/actions/cart/simulation.ts": $$$$$$$$$3,
    "vnda/actions/cart/updateCart.ts": $$$$$$$$$1,
    "vnda/actions/cart/updateItem.ts": $$$$$$$$$0,
  },
  "name": "vnda",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
