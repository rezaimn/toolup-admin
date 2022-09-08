import React from "react";
import { loadable } from "Helpers/loadable";

export default loadable(() => import("./UiSheet"), {
fallback: null,
});