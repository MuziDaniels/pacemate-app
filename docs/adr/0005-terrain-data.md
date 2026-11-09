# ADR 0005: Terrain from a DEM, not phone GPS altitude
Status: Accepted; source selection open (2026-11-09)

Context: Phone GPS altitude is far too noisy for grade work. Steep-road
awareness is the differentiator and must be trustworthy.

Decision: Elevation comes from a digital elevation model sampled along the
route every 10-20 m, smoothed, then segmented into climbs. Candidates to
verify (coverage of SA, cost, licence): Copernicus GLO-30 via Open Topo Data
(self-hostable), or Mapbox Terrain tiles. Decide in Slice 4 after a spike on
Comrades route data; record the pick by updating this ADR.

Consequences: Terrain is server-side (DEM too big for the phone); results are
cached per route segment so lookups are cheap during live sessions.
