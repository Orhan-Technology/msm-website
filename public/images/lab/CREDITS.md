# Laboratory image sources

Used by the "Testing laboratory" section (`lab` in `lib/content.ts`, surfaced through the
`home.lab` CMS section). Replace with MSM's own lab photography when available, and delete
the matching credit in `components/Footer.tsx`.

| File | Panel | Source | Licence | Attribution required |
|------|-------|--------|---------|----------------------|
| `tensile-test.jpg` | Tensile test | [Eprouvette plate cassee wb](https://commons.wikimedia.org/wiki/File:Eprouvette_plate_cassee_wb.JPG) — fractured specimen in the grips of a universal testing machine | Public domain (Cdang) | No |
| `bend-test.jpg` | Bend test | [Three point flexural test](https://commons.wikimedia.org/wiki/File:Three_point_flexural_test.jpg) — Instron 4486 three-point bend | CC BY-SA 3.0 | Yes — Cjp24 |
| `chemical-analysis.jpg` | Chemical analysis | [Sample preparation for XRF composition analysis](https://commons.wikimedia.org/wiki/File:Pr%C3%A9paration_d%27%C3%A9chantillons_pour_l%27analyse_de_la_composition_chimique_de_roches_par_fluorescence_X_(Ifremer_00702-81381_-_33933).jpg) | CC BY 4.0 | Yes — Stéphane Lesbats |
| `reports-engineer.jpg` | Sample test reports | already in the repo | unverified | Unknown |

All three are cropped to 4:3 (1600×1200); crops of a CC BY / CC BY-SA image are derivative
works and carry the same licence.

## Caveats

- `chemical-analysis.jpg` is a **geology** lab preparing rock samples for XRF, not a steel
  mill. The instrument and the work are real analytical chemistry, but the sample is not
  steel. A mill measures billet chemistry on a spark-OES spectrometer; no freely-licensed
  photo of one exists.
- `tensile-test.jpg` and `bend-test.jpg` show flat specimens, not rebar. The machines and
  the tests are exactly right; the specimen shape is not MSM's product.

## Replaced (do not restore)

These were the previous files — none showed the test they claimed:

- `tensile-gauge.jpg` — a pressure gauge on stainless piping (brewing/food equipment).
- `bend-machining.jpg` — laser or plasma cutting sparks, not a bend test.
- `chemical-beakers.jpg` — generic glassware. Steel chemistry is not done in beakers.
