import type { CSSProperties } from "react";
import type { AtlasLayer } from "../../content/atlas-layers";
import { LayerIcon } from "../icons/layer-icons";

export function AtlasPlate({ layer, index }: { readonly layer: AtlasLayer; readonly index: number }) {
  return (
    <li className="atlas-plate" data-plate={index} style={{ "--plate-index": index } as CSSProperties}>
      <LayerIcon id={layer.id} />
      <span className="atlas-plate__label">{layer.label}</span>
    </li>
  );
}
