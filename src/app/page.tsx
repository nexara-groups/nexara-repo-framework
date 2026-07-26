import { AtlasHero } from "../components/hero/atlas-hero";
import { PageFrame } from "../components/layout/page-frame";
import { ATLAS_LAYERS } from "../content/atlas-layers";

export default function HomePage() {
  return (
    <PageFrame>
      <AtlasHero layers={ATLAS_LAYERS} />
    </PageFrame>
  );
}
