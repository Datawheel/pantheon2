"use client";

import {store} from "../libs/store";
import {Provider} from "react-redux";

function ReduxProvider({children}) {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
