import { ShaderChunk } from "three";

/**
 * @shadergradient/react ships GLSL written against an older three.js and
 * `#include`s chunks that three r187 renamed or removed. Without these the
 * shader fails to compile ("Can not resolve #include <…>") and the gradient
 * never draws.
 *
 * - encodings_fragment was renamed to colorspace_fragment.
 * - The rest are only used for features ShaderGradient leaves off
 *   (cube-UV env maps, transmission maps, a second UV set), so empty
 *   chunks are safe while we use lightType="3d".
 *
 * Import this module before rendering any <ShaderGradient>.
 */
const chunks = ShaderChunk as unknown as Record<string, string>;

const polyfills: Record<string, string> = {
  encodings_fragment: chunks.colorspace_fragment ?? "",
  cube_uv_reflection_fragment: "",
  transmissionmap_fragment: "",
  transmissionmap_pars_fragment: "",
  uv2_pars_fragment: "",
  uv2_pars_vertex: "",
  uv2_vertex: "",
};

for (const [name, source] of Object.entries(polyfills)) {
  if (chunks[name] === undefined) chunks[name] = source;
}
