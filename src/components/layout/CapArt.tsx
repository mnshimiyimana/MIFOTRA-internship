
/*
 * The CTA's picture: the certificate the program awards, built from the
 * program's own material (its cap mark, its name, the cover's imigongo).
 */

export type CapOption = "certificate";

const WHITE = "#ffffff";
const BLUE = "#33478e";
const YELLOW = "#f7d117";
const SKY = "#3cb4ea";
const GREEN = "#3f9b4f";

const BOARD = "M100 28 194 70 100 112 6 70Z";
const SKULL = "M42 90v38c0 13 26 30 58 30s58-17 58-30V90l-58 26Z";

/** The program's cap mark, solid, in a 200×200 box. */
function CapMark({ fill = WHITE, tassel = YELLOW }) {
  return (
    <>
      <path d={BOARD} fill={fill} />
      <path d={SKULL} fill={fill} />
      <path d="M172 78v52" stroke={tassel} strokeWidth="7" strokeLinecap="round" />
      <rect x="162" y="128" width="20" height="34" rx="8" fill={tassel} />
    </>
  );
}

/* ── Certificate card ────────────────────────────────────────────────── */

function Certificate() {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white text-left shadow-[0_24px_50px_-24px_rgb(8_22_56/70%)]">
      {/* A strip of the cover's chevrons along the top edge */}
      <svg viewBox="0 0 320 14" preserveAspectRatio="none" aria-hidden="true" className="block h-3.5 w-full">
        {Array.from({ length: 23 }, (_, k) => (
          <path
            key={k}
            d={`M${k * 14} ${k % 2 ? 0 : 14}L${k * 14 + 7} ${k % 2 ? 14 : 0}L${k * 14 + 14} ${k % 2 ? 0 : 14}`}
            fill="none"
            stroke={[YELLOW, SKY, GREEN][k % 3]}
            strokeWidth="2.4"
          />
        ))}
      </svg>
      <div className="px-6 pt-5 pb-6">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 200 200" aria-hidden="true" className="size-6">
            <CapMark fill={BLUE} tassel={YELLOW} />
          </svg>
          <span className="text-[0.65rem] font-extrabold tracking-[0.16em] text-book-blue uppercase">
            Republic of Rwanda · MIFOTRA
          </span>
        </div>
        <p className="mt-5 font-heading text-xl leading-tight font-extrabold text-portal-navy">
          Certificate of Internship
        </p>
        <p className="mt-1 text-xs text-[#4b5b6e]">
          National Internship Program
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 text-[0.65rem] font-bold tracking-[0.12em] text-[#7a8aa6] uppercase">
          <div>
            <span className="block h-px bg-[#c9d5ea]" />
            <span className="mt-1.5 block">Intern</span>
          </div>
          <div>
            <span className="block h-px bg-[#c9d5ea]" />
            <span className="mt-1.5 block">6–12 months</span>
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div className="text-[0.65rem] font-bold tracking-[0.12em] text-[#7a8aa6] uppercase">
            <span className="block w-28 h-px bg-[#c9d5ea]" />
            <span className="mt-1.5 block">Signed, MIFOTRA</span>
          </div>
          <span className="grid size-12 place-items-center rounded-full bg-book-yellow">
            <svg viewBox="0 0 200 200" aria-hidden="true" className="size-7">
              <CapMark fill={BLUE} tassel={BLUE} />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export function CapArt({ option }: { option: CapOption }) {
  switch (option) {
    case "certificate":
      return <Certificate />;
  }
}

/** How wide each treatment sits in the band's right column. */
export const CAP_WIDTH: Record<CapOption, string> = {
  certificate: "max-w-[20rem]",
};
