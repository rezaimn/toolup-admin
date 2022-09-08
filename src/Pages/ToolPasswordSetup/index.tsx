import React from "react";
import { loadable } from "Helpers/loadable";

export default loadable(() => import("./ToolPasswordSetup"), {
fallback: null,
});