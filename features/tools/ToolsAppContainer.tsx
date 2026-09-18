"use client";

import { httpAppDataRepository } from "./infrastructure/http-app-data-repository";
import ToolsApp from "./presentation/ToolsApp";

export default function ToolsAppContainer() {
  return <ToolsApp repository={httpAppDataRepository} />;
}
