import styles from './Beaver.module.css';

const LABELS = {
  asleep: 'A beaver napping until the next check',
  checking: "A beaver checking the clerk's website on a laptop",
  sad: 'A sad beaver: no results yet',
  dancing: 'A happy beaver dancing because the results are in',
  curled: 'A beaver curled up asleep, waiting for the polls to close',
};

// A beaver who naps next to a laptop between checks, sits up to check the
// clerk's site, and looks sad when there's nothing there yet.
// `mood` is 'asleep', 'checking', 'sad', 'dancing' (results are in!) or 'curled'
// (fast asleep, no laptop, before checking starts). The laptop is turned toward the beaver.
export default function Beaver({ mood }) {
  return (
    <svg viewBox="0 0 220 160" className={`${styles.beaver} ${styles[mood]}`} role="img" aria-label={LABELS[mood]}>
      <defs>
        <radialGradient id="beaver-fur" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#a46d48" />
          <stop offset="1" stopColor="#74452a" />
        </radialGradient>
        <radialGradient id="beaver-belly" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ecc392" />
          <stop offset="1" stopColor="#c99560" />
        </radialGradient>
        <linearGradient id="beaver-tail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#56392a" />
          <stop offset="1" stopColor="#3b261b" />
        </linearGradient>
        <pattern id="beaver-scales" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <path d="M0 0 H6 M0 0 V6" stroke="#2c1b12" strokeWidth="0.9" opacity="0.6" />
        </pattern>
        <radialGradient id="beaver-glow">
          <stop offset="0" stopColor="#7ff0cf" stopOpacity="0.5" />
          <stop offset="1" stopColor="#7ff0cf" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="beaver-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9ffe9" />
          <stop offset="1" stopColor="#3cc3a0" />
        </linearGradient>
        {/* The head's silhouette, drawn twice: once fat for the outline, once for the fill. */}
        <g id="beaver-head">
          <circle cx="90" cy="44" r="8" />
          <circle cx="124" cy="41" r="8" />
          <circle cx="108" cy="65" r="25" />
          <ellipse cx="113" cy="79" rx="24" ry="15" />
        </g>
      </defs>

      <ellipse cx="112" cy="150" rx="100" ry="5" className={styles.shadow} />

      {/* Curled up asleep like a loaf, head resting on its paws, tail flat behind */}
      <g className={styles.curl}>
        <ellipse cx="34" cy="138" rx="32" ry="12" transform="rotate(-6 34 138)" className={styles.tail} />
        <ellipse cx="34" cy="138" rx="32" ry="12" transform="rotate(-6 34 138)" fill="url(#beaver-scales)" />
        <path d="M48 147 C42 118 70 100 102 101 C132 102 152 118 152 147 Z" className={styles.fur} />
        {/* Haunch and tucked back foot */}
        <path d="M60 143 C58 127 72 117 90 121" className={styles.detail} />
        <ellipse cx="62" cy="146" rx="11" ry="4" className={styles.furDark} />
        <g transform="translate(30 54) rotate(8 108 65)">
          <use href="#beaver-head" className={styles.headOutline} />
          <use href="#beaver-head" className={styles.headFill} />
          <circle cx="90" cy="44" r="4" className={styles.earInner} />
          <circle cx="124" cy="41" r="4" className={styles.earInner} />
          <ellipse cx="124" cy="77" rx="15" ry="11" className={styles.belly} />
          <ellipse cx="106" cy="77" rx="5" ry="3" className={styles.blush} />
          <path d="M135 79 l12 -2 M135 82 l12 1.5 M134 85 l10 4.5" className={styles.whiskers} />
          <rect x="122" y="83" width="11" height="9" rx="2.5" className={styles.teeth} />
          <path d="M127.5 83 v9" className={styles.detail} />
          <ellipse cx="136" cy="70" rx="6.5" ry="4.6" className={styles.nose} />
          <ellipse cx="134.2" cy="68.4" rx="2" ry="1.1" className={styles.noseShine} />
          <path d="M109.5 61 q4.5 3.8 9 0 M124.5 59 q3.5 3.2 7 0" className={styles.curlEyes} />
        </g>
        {/* Front paws tucked under the cheek, behind the teeth */}
        <ellipse cx="126" cy="146" rx="9" ry="4.5" className={styles.furDark} />
        <ellipse cx="139" cy="147" rx="8.5" ry="4.5" className={styles.fur} />
        <path d="M142 144.5 v3.5 M145 145 v3" className={styles.detail} />
      </g>

      {/* Laptop, seen from the side and angled toward the beaver */}
      <g className={styles.laptop}>
        <path d="M128 131 L174 136 L192 141 L146 137 Z" className={styles.deck} />
        <path d="M146 137 L192 141 L192 144.5 L146 140.5 Z" className={styles.edge} />
        <path d="M128 131 L146 137 L146 140.5 L128 134.5 Z" className={styles.edgeDark} />
        <path d="M137 133.5 L170 137 M140 135.3 L176 139 M151 137.7 L172 139.8" className={styles.keys} />
        <path d="M174 136 L192 141 L204 86 L186 82 Z" className={styles.lid} />
        <path d="M177 133.5 L189.5 137.2 L200.5 89.6 L187.8 85.7 Z" className={styles.screen} />
        <path d="M187 89.5 l7 1.6 M185.9 94.3 l9 2 M184.8 99.1 l6 1.4 M182.8 107.7 l9 2" className={styles.screenLines} />
        <circle cx="187" cy="142.6" r="0.9" className={styles.led} />
      </g>

      <g className={styles.body}>
        {/* Tail */}
        <path
          d="M70 134 C56 124 24 121 13 132 C5 141 25 152 50 148 C61 146 70 142 75 138 Z"
          className={styles.tail}
        />
        <path d="M70 134 C56 124 24 121 13 132 C5 141 25 152 50 148 C61 146 70 142 75 138 Z" fill="url(#beaver-scales)" />

        {/* Far arm, behind the body */}
        <g className={`${styles.typing} ${styles.armFar}`}>
          <path d="M110 98 C114 94 120 95 123 99 L141 119 C145 123 151 125 157 126 L160 135 C149 135 138 135 131 131 L109 108 C106 105 107 100 110 98 Z" className={styles.furDark} />
          <ellipse cx="160" cy="132" rx="6.5" ry="4" transform="rotate(14 160 132)" className={styles.furDark} />
        </g>

        <ellipse cx="90" cy="115" rx="36" ry="33" className={styles.fur} />
        <ellipse cx="102" cy="121" rx="21" ry="24" className={styles.belly} />

        {/* Feet */}
        <ellipse cx="78" cy="146" rx="12" ry="5.5" className={styles.furDark} />
        <ellipse cx="108" cy="147" rx="12.5" ry="5.5" className={styles.furDark} />
        <path d="M114 144.5 v4 M118 144.8 v3.6" className={styles.detail} />

        {/* Paws folded on the belly while napping */}
        <g className={styles.restingPaws}>
          <ellipse cx="112" cy="104" rx="8" ry="5.5" className={styles.furDark} />
          <ellipse cx="121" cy="109" rx="7.5" ry="5" className={styles.fur} />
          <path d="M124 106.5 v3 M127 107.5 v2.6" className={styles.detail} />
        </g>

        {/* Far arm thrown up for the dance, behind the head */}
        <g className={styles.cheer}>
          <g className={styles.cheerFar}>
            <path d="M86 98 Q75 90 71 75" className={styles.limbOutline} />
            <path d="M86 98 Q75 90 71 75" className={`${styles.limb} ${styles.limbDark}`} />
            <circle cx="70.5" cy="73" r="6" className={styles.furDark} />
          </g>
        </g>

        {/* Near arm, reaching for the keyboard */}
        <g className={`${styles.typing} ${styles.armNear}`}>
          <path d="M100 101 C104 97 110 98 113 102 L131 122 C135 126 140 128 146 129 L149 138 C138 139 127 139 121 135 L99 112 C96 109 97 104 100 101 Z" className={styles.fur} />
          <ellipse cx="149" cy="134" rx="7.5" ry="4.5" transform="rotate(14 149 134)" className={styles.fur} />
          <path d="M152 131.5 l1.2 3 M155 132.5 l1 2.6" className={styles.detail} />
        </g>

        <g className={styles.head}>
          <use href="#beaver-head" className={styles.headOutline} />
          <use href="#beaver-head" className={styles.headFill} />
          <circle cx="90" cy="44" r="4" className={styles.earInner} />
          <circle cx="124" cy="41" r="4" className={styles.earInner} />
          {/* Cheek fluff */}
          <path d="M88 80 l-3 3 l4 -0.5 M90 84 l-2 3.5 l3.5 -1.5" className={styles.fluff} />
          <ellipse cx="124" cy="77" rx="15" ry="11" className={styles.belly} />
          <ellipse cx="106" cy="77" rx="5" ry="3" className={styles.blush} />
          <path d="M135 79 l12 -2 M135 82 l12 1.5 M134 85 l10 4.5" className={styles.whiskers} />
          <rect x="122" y="83" width="11" height="10" rx="2.5" className={styles.teeth} />
          <path d="M127.5 83 v10" className={styles.detail} />
          <path d="M131 81 q-3 2.5 -8 1.2" className={`${styles.detail} ${styles.smile}`} />
          <ellipse cx="136" cy="70" rx="6.5" ry="4.6" className={styles.nose} />
          <ellipse cx="134.2" cy="68.4" rx="2" ry="1.1" className={styles.noseShine} />

          <g className={styles.eyesOpen}>
            <path d="M109 52 q5 -3.5 10 -0.5 M124 50 q4 -2.5 8 0" className={styles.brows} />
            <circle cx="114" cy="61" r="4.4" className={styles.eye} />
            <circle cx="115.7" cy="59.3" r="1.6" className={styles.shine} />
            <circle cx="112.8" cy="62.8" r="0.7" className={styles.shine} />
            <circle cx="128" cy="59" r="3.6" className={styles.eye} />
            <circle cx="129.3" cy="57.6" r="1.3" className={styles.shine} />
          </g>
          <path d="M109.5 61 q4.5 3.8 9 0 M124.5 59 q3.5 3.2 7 0" className={styles.eyesClosed} />

          <g className={styles.happyFace}>
            {/* Squinty smiling eyes and a big grin */}
            <path d="M109.5 62.5 q4.5 -5 9 0 M124.5 60.5 q3.5 -4.4 7 0" className={styles.eyesClosed} />
            <path d="M118.5 80 q7 4.5 14 -0.8" className={styles.grin} />
            <ellipse cx="106" cy="76" rx="6" ry="3.6" className={styles.blush} />
          </g>

          <g className={styles.sadFace}>
            {/* Droopy lids, worried brows, a frown and a tear */}
            <path d="M108.5 61.5 Q108.6 55.6 114 55.6 Q119.6 55.7 120 59.5 Q114 58 108.5 61.5 Z M123.5 57.5 Q123.8 54.4 128 54.4 Q132 54.6 132.5 59 Q128 56.5 123.5 57.5 Z" className={styles.lids} />
            <path d="M108.5 61.5 Q114 58 120 59.5 M123.5 57.5 Q128 56.5 132.5 59" className={styles.detail} />
            <path d="M108 54 q5 -1 11 -5.5 M124 48 q4 1 8.5 4" className={styles.brows} />
            <path d="M131 83.5 q-3.5 -2.8 -8 -0.4" className={styles.detail} />
            <path d="M110 65 q-2.4 3.4 0 5 q2.4 -1.6 0 -5 Z" className={styles.tear} />
          </g>
        </g>

        {/* Near arm thrown up for the dance, in front of the head */}
        <g className={`${styles.cheer} ${styles.cheerNear}`}>
          <path d="M106 105 Q122 104 135 99" className={styles.limbOutline} />
          <path d="M106 105 Q122 104 135 99" className={styles.limb} />
          <circle cx="137" cy="98" r="6.5" className={styles.fur} />
        </g>
      </g>

      {/* Screen light falling on the beaver's face */}
      <ellipse cx="165" cy="95" rx="60" ry="52" fill="url(#beaver-glow)" className={styles.glow} />

      <g className={styles.zzz} aria-hidden="true">
        <text x="132" y="38" fontSize="10">z</text>
        <text x="141" y="27" fontSize="13">z</text>
        <text x="152" y="14" fontSize="16">Z</text>
      </g>

      <g className={styles.notes} aria-hidden="true">
        <text x="40" y="70" fontSize="16">♪</text>
        <text x="160" y="50" fontSize="18">♫</text>
        <text x="28" y="40" fontSize="13">♫</text>
        <text x="182" y="28" fontSize="14">♪</text>
      </g>
    </svg>
  );
}
