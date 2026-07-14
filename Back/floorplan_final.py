# ===============================================
# floorplan_final.py
# Fixed Multi-Design Floorplan Generator
# ===============================================

from pathlib import Path
import os
import random, math
from dataclasses import dataclass
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for server use
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from shapely.geometry import Polygon, Point, LineString, MultiLineString, box
from shapely.affinity import scale
from shapely.ops import unary_union
from PIL import Image
import json

# ---- Building Types ----
BUILDING_TYPES = {
    "HOUSE": {"name": "House", "cost_per_sqm": 2000, "default_land": (24, 14), "default_budget": 350000},
    "HOSPITAL": {"name": "Hospital", "cost_per_sqm": 5000, "default_land": (50, 40), "default_budget": 2000000},
    "COMPANY": {"name": "Office Building", "cost_per_sqm": 3000, "default_land": (40, 30), "default_budget": 800000},
    "SCHOOL": {"name": "School", "cost_per_sqm": 2500, "default_land": (60, 50), "default_budget": 1500000},
}

# ---- Colors ----
COL = {
    "public": "#ffeedd", "service": "#f7ffd8", "private": "#dde9ff", "circulation": "#f2f2f2",
    "Entry": "#fff4cc", "Living": "#ffe6cc", "Dining": "#ffdacc", "Kitchen": "#ffeccc",
    "Pantry / Flex": "#f2ffcc", "Family / Lounge": "#d6ffcc", "Master Bedroom": "#cce6ff",
    "Bedroom": "#cce6ff", "Study": "#e6ccff", "Bath": "#ccfff9", "Utility": "#f0f0f0",
    "Reception": "#e6f2ff", "Waiting": "#f0f8ff", "Consultation": "#e6ffe6",
    "Patient Room": "#fff0f5", "ICU": "#ffe6e6", "Operating Room": "#fff5ee",
    "Pharmacy": "#f0fff0", "Lab": "#f5f5f5", "Radiology": "#f8f8ff",
    "Nurses Station": "#e6f7ff", "Admin": "#f5f5f5", "Admin Office": "#f5f5f5",
    "Lobby": "#f5f5f5", "Open Office": "#e6f2ff", "Manager Office": "#fff0e6",
    "Meeting Room": "#e6ffe6", "Conference": "#fff5e6", "Break Room": "#ffe6e6",
    "IT Room": "#f0f0f0", "Print Room": "#f5f5f5", "Storage": "#e6e6e6",
    "Classroom": "#e6f2ff", "Science Lab": "#e6ffe6", "Computer Lab": "#f0f0f0",
    "Library": "#fff0e6", "Gym": "#ffe6e6", "Cafeteria": "#fff5e6",
    "Auditorium": "#f0f8ff", "Arts Room": "#fff5f5",
    "Parking": "#e0e0e0", "Bathroom": "#ccfff9"
}

# ---- Room size limits (m²) ----
ROOM_SIZE_LIMITS = {
    "Entry": (4, 10), "Living": (22, 45), "Dining": (12, 25), "Kitchen": (10, 20),
    "Pantry / Flex": (4, 10), "Family / Lounge": (12, 25),
    "Master Bedroom": (16, 30), "Bedroom": (10, 20), "Study": (8, 16), "Bath": (4, 8), "Utility": (4, 10),
    "Reception": (22, 40), "Waiting": (26, 55), "Consultation": (14, 24),
    "Patient Room": (18, 28), "ICU": (26, 38), "Operating Room": (34, 48),
    "Pharmacy": (12, 20), "Lab": (18, 28), "Radiology": (24, 36),
    "Nurses Station": (16, 24), "Admin": (16, 26),
    "Lobby": (12, 25), "Open Office": (40, 90), "Manager Office": (16, 28),
    "Meeting Room": (18, 32), "Conference": (30, 48), "Break Room": (10, 18),
    "IT Room": (8, 15), "Print Room": (6, 12), "Storage": (6, 16), "Server Room": (8, 16),
    "Classroom": (48, 68), "Science Lab": (36, 54), "Computer Lab": (30, 44),
    "Library": (40, 68), "Cafeteria": (55, 95),
    "Admin Office": (16, 28), "Gym": (90, 140), "Arts Room": (32, 44), "Auditorium": (90, 140),
    "Bathroom": (4, 8), "Parking": (12, 40)
}

# ---- Data model ----
@dataclass
class Zone:
    name: str
    kind: str
    weight: float
    poly: Polygon = None
    area: float = 0.0

# ---- Configs ----
BUILDING_CONFIGS = {
    "HOUSE": {
        "band_weights": {"low": [0.30,0.27,0.12,0.31], "medium": [0.32,0.28,0.13,0.27], "high": [0.34,0.28,0.14,0.24]},
        "public_rooms": {"Entry":0.08, "Living":0.36, "Dining":0.22, "Master Bedroom":0.34},
        "service_rooms": {"Pantry / Flex":0.22, "Kitchen":0.36, "Family / Lounge":0.42},
        "private_base": {"Utility":0.12, "Study":0.14, "Bath":0.16, "Bedroom":0.58},
        "requires_parking": True
    },
    "HOSPITAL": {"requires_parking": True},
    "COMPANY": {
        "band_weights": {"low": [0.22,0.46,0.12,0.20], "medium": [0.24,0.44,0.12,0.20], "high": [0.26,0.42,0.12,0.20]},
        "public_rooms": {"Lobby":0.30, "Meeting Room":0.30, "Conference":0.40},
        "service_rooms": {"Open Office":0.60, "Manager Office":0.25, "Break Room":0.10, "IT Room":0.05},
        "private_base": {"Storage":0.30, "Print Room":0.20, "Bathroom":0.30, "Server Room":0.20},
        "requires_parking": True
    },
    "SCHOOL": {
        "band_weights": {"low": [0.30,0.40,0.15,0.15], "medium": [0.32,0.38,0.17,0.13], "high": [0.35,0.35,0.20,0.10]},
        "public_rooms": {"Admin Office":0.25, "Library":0.35, "Cafeteria":0.40},
        "service_rooms": {"Science Lab":0.30, "Computer Lab":0.20, "Arts Room":0.20},
        "private_base": {"Storage":0.30, "Bathroom":0.40, "Gym":0.30},
        "requires_parking": True
    }
}

# ---- Helpers ----
def classify_budget(b):
    if b <= 200_000: return "low"
    if b <= 700_000: return "medium"
    return "high"

def clamp(v, lo, hi):
    return max(lo, min(hi, v))

def scaled_room_area(room_type, total_area, tier):
    lo, hi = ROOM_SIZE_LIMITS.get(room_type, (10,20))
    tier_factor = {"low":0.95, "medium":1.0, "high":1.08}[tier]
    area_factor = 1.0 + min(0.35, (total_area/1200.0)*0.1)
    return random.uniform(lo, hi) * tier_factor * area_factor

def longest_shared_segment(a: Polygon, b: Polygon):
    inter = a.boundary.intersection(b.boundary)
    if inter.is_empty:
        return None
    if isinstance(inter, LineString) and inter.length >= 0.1:
        return inter
    if isinstance(inter, MultiLineString):
        segs = [g for g in inter.geoms if g.length >= 0.1]
        if segs:
            return max(segs, key=lambda s: s.length)
    return None

def segment_mid_normal(seg: LineString, outward_from: Polygon):
    (x1,y1),(x2,y2) = list(seg.coords)[:2]
    mx,my = (x1+x2)/2, (y1+y2)/2
    dx,dy = (x2-x1, y2-y1)
    L = math.hypot(dx,dy) or 1.0
    nx,ny = -dy/L, dx/L
    if outward_from.contains(Point(mx+nx*0.3, my+ny*0.3)):
        nx,ny = -nx,-ny
    return (mx,my),(dx,dy),(nx,ny)

def draw_window_on_segment(ax, seg: LineString, size=1.4, lw=5, z=35):
    (x1,y1),(x2,y2) = list(seg.coords)[:2]
    mx,my = (x1+x2)/2, (y1+y2)/2
    dx,dy = x2-x1, y2-y1
    L = math.hypot(dx,dy) or 1.0
    ux,uy = dx/L, dy/L
    w = min(size, L*0.6)
    x0,y0 = mx - ux*w/2, my - uy*w/2
    x1,y1 = mx + ux*w/2, my + uy*w/2
    ax.plot([x0,x1],[y0,y1], color="white", lw=lw, solid_capstyle='butt', zorder=z)
    ax.plot([x0,x1],[y0,y1], color="black", lw=1.2, zorder=z+1)

def draw_door_between(ax, a: Polygon, b: Polygon, gap=0.9, z=40):
    seg = longest_shared_segment(a,b)
    if not seg:
        return
    (mx,my),(dx,dy),(nx,ny) = segment_mid_normal(seg, outward_from=a)
    L = math.hypot(dx,dy) or 1.0
    ux,uy = dx/L, dy/L
    gap = min(gap, seg.length*0.6)
    x0,y0 = mx - ux*gap/2, my - uy*gap/2
    x1,y1 = mx + ux*gap/2, my + uy*gap/2
    ax.plot([x0,x1],[y0,y1], color="white", lw=6, solid_capstyle='butt', zorder=z)
    ax.plot([x0,x1],[y0,y1], color="black", lw=1.2, zorder=z+1)
    r = 0.45
    angle = math.degrees(math.atan2(uy,ux))
    arc = patches.Arc((x0,y0), 2*r, 2*r, angle=angle, theta1=0, theta2=90, lw=1.2, zorder=z+1)
    ax.add_patch(arc)

def place_driveway(land: Polygon, build: Polygon, entry: Polygon, cars=2):
    seg = longest_shared_segment(entry, build)
    if not seg:
        return None
    (mx,my),(dx,dy),(nx,ny) = segment_mid_normal(seg, outward_from=build)
    car_w, car_d = 2.5, 5.0
    width = max(car_w*cars + 0.6*(cars-1), 4.8)
    depth = 3.2 if cars==1 else 5.0
    L = seg.length
    take = min(L*0.6, width)
    ux,uy = (dx/(L or 1.0), dy/(L or 1.0))
    cx0, cy0 = mx - ux*take/2, my - uy*take/2
    cx1, cy1 = mx + ux*take/2, my + uy*take/2
    offset = 0.8
    p = Polygon([
        (cx0,cy0), (cx1,cy1),
        (cx1+nx*(depth+offset), cy1+ny*(depth+offset)),
        (cx0+nx*(depth+offset), cy0+ny*(depth+offset))
    ])
    park = p.intersection(land).difference(build.buffer(0.05))
    if park.is_empty:
        return None
    if park.geom_type == "MultiPolygon":
        park = max(park.geoms, key=lambda g: g.area)
    return park

def make_land(shape: str, W: float, H: float) -> Polygon:
    if shape == "rectangle":
        return box(0,0,W,H)
    if shape == "square":
        s = min(W,H); dx = (W-s)/2; dy = (H-s)/2
        return box(dx,dy,dx+s,dy+s)
    if shape == "Lshape":
        land = box(0,0,W,H)
        notch = box(0, H*0.58, W*0.35, H)
        return land.difference(notch)
    if shape == "triangle":
        return Polygon([(0,0), (W,0), (W*0.5, H)])
    if shape == "irregular":
        pts = [(0.08*W,0.07*H), (0.88*W,0.02*H), (W,0.60*H),
               (0.78*W,H), (0.18*W,0.92*H), (0.00*W,0.38*H)]
        return Polygon(pts)
    if shape == "courtyard":
        outer = box(0, 0, W, H)
        inner = box(W*0.3, H*0.3, W*0.7, H*0.7)
        return outer.difference(inner)
    return box(0,0,W,H)

def safe_inner(poly: Polygon, setback: float) -> Polygon:
    inner = poly.buffer(-setback, join_style=2)
    if inner.is_empty:
        inner = poly.buffer(-setback*0.5, join_style=2)
    if inner.is_empty:
        cx,cy = poly.centroid.coords[0]
        minx,miny,maxx,maxy = poly.bounds
        w = max(4,(maxx-minx)*0.3); h = max(4,(maxy-miny)*0.3)
        inner = box(cx-w/2, cy-h/2, cx+w/2, cy+h/2)
    return inner

def oriented_footprint(land: Polygon, fill=0.88):
    siteA = land.area
    inner = safe_inner(land, max(0.6, 0.02*math.sqrt(siteA)))
    mbr = land.minimum_rotated_rectangle
    cx, cy = mbr.centroid.coords[0]
    factor = min(0.98, math.sqrt((siteA*fill)/max(1e-6, mbr.area)))
    core = scale(mbr, xfact=factor, yfact=factor, origin=(cx,cy))
    core = core.intersection(inner)
    rounded = core.buffer(0.35, join_style=2).intersection(inner)
    if rounded.geom_type == "MultiPolygon":
        rounded = max(rounded.geoms, key=lambda g: g.area)
    return rounded

def split_h(poly: Polygon, ratios):
    if poly.is_empty or poly.area < 1e-6:
        return [poly] * len(ratios)
    s = sum(ratios) if ratios else 1.0
    ratios = [r/s for r in ratios]
    minx,miny,maxx,maxy = poly.bounds
    ys = [miny]; acc = miny
    for i, r in enumerate(ratios):
        if i == len(ratios)-1:
            ys.append(maxy); break
        acc += (maxy-miny)*r; ys.append(acc)
    result = []
    for y0, y1 in zip(ys[:-1], ys[1:]):
        part = poly.intersection(box(minx, y0, maxx, y1))
        result.append(part if not part.is_empty else poly)
    return result

def split_v(poly: Polygon, widths):
    if poly.is_empty or poly.area < 1e-6:
        return [poly] * len(widths)
    total = sum(widths) if widths else 1.0
    widths = [w / total for w in widths]
    minx, miny, maxx, maxy = poly.bounds
    xs = [minx]
    acc = minx
    for i, w in enumerate(widths):
        if i == len(widths) - 1:
            xs.append(maxx)
            break
        acc += (maxx - minx) * w
        xs.append(acc)
    result = []
    for x0, x1 in zip(xs[:-1], xs[1:]):
        part = poly.intersection(box(x0, miny, x1, maxy))
        result.append(part if not part.is_empty else poly)
    return result

def split_by_area(poly: Polygon, target_areas):
    total = sum(max(0.01, a) for a in target_areas) or 1.0
    ratios = [a/total for a in target_areas]
    return split_v(poly, ratios)

def calculate_room_areas(zones):
    for zone in zones:
        if zone.poly and not zone.poly.is_empty:
            zone.area = zone.poly.area

def sort_zones_by_x(zones):
    return sorted(zones, key=lambda z: z.poly.centroid.x if z.poly else 0.0)

# ---- Engine ----
class MultiBuildingEngine:
    def __init__(self, building_type="HOUSE", land_shape="rectangle", W=24, H=14, budget=400_000, seed=None):
        random.seed(seed)
        self.building_type = building_type
        self.building_config = BUILDING_CONFIGS[building_type]
        self.building_info = BUILDING_TYPES[building_type]
        self.land = make_land(land_shape, W, H)
        self.tier = classify_budget(budget)
        self.total_building_area = 0.0

    def footprint(self):
        fill = {"low":0.82, "medium":0.86, "high":0.90}[self.tier]
        footprint = oriented_footprint(self.land, fill=fill)
        self.total_building_area = footprint.area
        return footprint

    def _smart_counts(self, area):
        bt = self.building_type
        counts = {}
        if bt == "HOSPITAL":
            counts["Patient Room"] = clamp(int(area/160), 10, 24)
            counts["ICU"] = clamp(int(area/1200)+2, 2, 6)
            counts["Operating Room"] = clamp(int(area/1800)+2, 2, 4)
            counts["Bathroom"] = clamp(int(area/2200)+2, 2, 3)
        elif bt == "COMPANY":
            counts["Storage"] = clamp(int(area/1400)+1, 1, 2)
            counts["Bathroom"] = clamp(int(area/2000)+1, 1, 2)
            counts["Server Room"] = clamp(int(area/2200)+1, 1, 2)
            counts["Print Room"] = clamp(int(area/2500)+1, 1, 2)
        elif bt == "SCHOOL":
            counts["Classroom"] = clamp(int(area/500)+6, 6, 10)
            counts["Science Lab"] = clamp(int(area/3500)+2, 2, 4)
            counts["Bathroom"] = clamp(int(area/3000)+1, 1, 2)
            counts["Storage"] = clamp(int(area/3000)+1, 1, 2)
        else:
            counts["Bedroom"] = 3
            counts["Bath"] = 2
        return counts

    def _group_rooms(self, base_name, per_room_type, total_count, per_group):
        groups = []
        n = max(1, per_group)
        idx, remaining = 1, total_count
        while remaining > 0:
            k = min(n, remaining)
            groups.append((f"{base_name} {idx}", per_room_type, k))
            remaining -= k
            idx += 1
        return groups

    def _merge_small(self, zones, min_area=20.0):
        if not zones:
            return zones
        kept = []
        for z in zones:
            if ("Bath" in z.name) or ("Bathroom" in z.name):
                kept.append(z)
                continue
            if z.poly.area >= min_area:
                kept.append(z)
            else:
                zx, zy = z.poly.centroid.coords[0]
                candidates = [w for w in zones if w is not z]
                if not candidates:
                    kept.append(z)
                    continue
                best = min(candidates, key=lambda w: (w.poly.centroid.x-zx)**2 + (w.poly.centroid.y-zy)**2)
                best.poly = unary_union([best.poly, z.poly]).buffer(0)
        return kept

    def layout(self, bedrooms=3, baths=2, with_study=True):
        build = self.footprint()
        bt = self.building_type

        if bt == "HOSPITAL":
            tier = self.tier
            band_front = {"low":0.28, "medium":0.30, "high":0.32}[tier]
            band_core  = {"low":0.44, "medium":0.44, "high":0.46}[tier]
            band_rear  = 1.0 - band_front - band_core
            front, core, rear = split_h(build, [band_front, band_core, band_rear])

            corridors = []
            for seg in (longest_shared_segment(front, core), longest_shared_segment(core, rear)):
                if seg and seg.length > 0.6:
                    virt = LineString(seg.coords).buffer(0.20, cap_style=2, join_style=2).intersection(build)
                    if not virt.is_empty:
                        corridors.append(virt)

            pub_labels = ["Reception","Waiting","Consultation","Admin"]
            targets = [scaled_room_area(n, self.total_building_area, self.tier) for n in pub_labels]
            z_front = [Zone(n,"public",t,p) for n,t,p in zip(pub_labels,targets,split_by_area(front, targets))]

            counts = self._smart_counts(self.total_building_area)
            wards = self._group_rooms("Patient Ward", "Patient Room", counts["Patient Room"], per_group=6)
            icus  = self._group_rooms("ICU Unit", "ICU", counts["ICU"], per_group=3)
            core_items = wards + icus + [("Nurses Station","Nurses Station",1)]
            core_targets = [m*scaled_room_area(t, self.total_building_area, self.tier) for _,t,m in core_items]
            core_names = [nm for nm,_,_ in core_items]
            z_core = [Zone(n,"private",w,p) for n,w,p in zip(core_names,core_targets,split_by_area(core, core_targets))]
            z_core = self._merge_small(z_core, 24.0)

            or_blocks = self._group_rooms("Operating Block", "Operating Room", counts["Operating Room"], per_group=2)
            rears = or_blocks + [("Radiology","Radiology",1), ("Lab","Lab",1), ("Pharmacy","Pharmacy",1)]
            for i in range(counts["Bathroom"]):
                rears.append((f"Bathroom {i+1}","Bathroom",1))
            rear_targets = [m*scaled_room_area(t, self.total_building_area, self.tier) for _,t,m in rears]
            rear_names = [nm for nm,_,_ in rears]
            z_rear = [Zone(n,"service",w,p) for n,w,p in zip(rear_names,rear_targets,split_by_area(rear, rear_targets))]
            z_rear = self._merge_small(z_rear, 22.0)

            zones = z_front + z_core + z_rear

            cx, cy = build.centroid.coords[0]
            rec = next((z for z in zones if "Reception" in z.name), None)
            if rec:
                best = min(zones, key=lambda z: (z.poly.centroid.x-cx)**2 + (z.poly.centroid.y-cy)**2)
                if best is not rec:
                    rec.poly, best.poly = best.poly, rec.poly

        else:
            w_pub, w_serv, w_corr, w_priv = self.building_config["band_weights"][self.tier]
            total = w_pub + w_serv + w_corr + w_priv
            public, service, private = split_h(build, [w_pub/total, (w_serv+0.30*w_corr)/total, (w_priv+0.70*w_corr)/total])

            corridors = []
            interface = longest_shared_segment(service, private)
            if interface and interface.length > 0.6:
                virt = LineString(interface.coords).buffer(0.20, cap_style=2, join_style=2).intersection(build)
                if not virt.is_empty:
                    corridors.append(virt)

            pub_labels = list(self.building_config["public_rooms"].keys())
            pub_targets = [scaled_room_area(n, self.total_building_area, self.tier) for n in pub_labels]
            z_public = [Zone(n,"public",w,p) for n,w,p in zip(pub_labels,pub_targets,split_by_area(public, pub_targets))]

            serv_labels = list(self.building_config["service_rooms"].keys())
            serv_targets = [scaled_room_area(n, self.total_building_area, self.tier) for n in serv_labels]
            z_service = [Zone(n,"service",w,p) for n,w,p in zip(serv_labels,serv_targets,split_by_area(service, serv_targets))]

            counts = self._smart_counts(self.total_building_area)
            priv_items = []
            if bt == "HOUSE":
                priv_items.append(("Utility","Utility",1))
                for i in range(2):
                    priv_items.append((f"Bedroom {i+1}","Bedroom",1))
                for i in range(max(2, baths)):
                    priv_items.append((f"Bath {i+1}","Bath",1))
                if with_study:
                    priv_items.append(("Study","Study",1))
            elif bt == "COMPANY":
                priv_items += [(f"Storage {i+1}","Storage",1) for i in range(counts["Storage"])]
                priv_items += [(f"Bathroom {i+1}","Bathroom",1) for i in range(counts["Bathroom"])]
                priv_items += [(f"Server Room {i+1}","Server Room",1) for i in range(counts["Server Room"])]
                priv_items += [(f"Print Room {i+1}","Print Room",1) for i in range(counts["Print Room"])]
            elif bt == "SCHOOL":
                wings = self._group_rooms("Classroom Wing", "Classroom", counts["Classroom"], per_group=4)
                labs  = self._group_rooms("Science Lab Block", "Science Lab", counts["Science Lab"], per_group=2)
                priv_items += wings + labs
                priv_items += [(f"Bathroom {i+1}","Bathroom",1) for i in range(counts["Bathroom"])]
                priv_items += [(f"Storage {i+1}","Storage",1) for i in range(counts["Storage"])]
                priv_items += [("Gym","Gym",1)]

            priv_targets = [m*scaled_room_area(t, self.total_building_area, self.tier) for _,t,m in priv_items]
            priv_names = [nm for nm,_,_ in priv_items]
            z_private = [Zone(n,"private",w,p) for n,w,p in zip(priv_names,priv_targets,split_by_area(private, priv_targets))]
            z_private = self._merge_small(z_private, 20.0)

            zones = z_public + z_service + z_private

            def push_small_edge(zlist):
                if not zlist:
                    return
                left_to_right = sort_zones_by_x(zlist)
                for z in left_to_right:
                    if any(k in z.name for k in ["Bathroom","Bath","Storage","Print","Server","IT Room"]):
                        target = left_to_right[0] if z.poly.centroid.x > (left_to_right[-1].poly.centroid.x) else left_to_right[-1]
                        if target is not z:
                            z.poly, target.poly = target.poly, z.poly

            push_small_edge(z_service)
            push_small_edge(z_private)

        central_map = {"HOUSE":"Living", "HOSPITAL":"Reception", "COMPANY":"Manager Office", "SCHOOL":"Admin Office"}
        target = central_map.get(bt)
        if target:
            z_central = next((z for z in zones if target in z.name), None)
            if z_central:
                cx, cy = build.centroid.coords[0]
                best = min(zones, key=lambda z: (z.poly.centroid.x-cx)**2 + (z.poly.centroid.y-cy)**2)
                if best is not z_central:
                    z_central.poly, best.poly = best.poly, z_central.poly

        calculate_room_areas(zones)

        parking = None
        if bt == "HOUSE":
            entry_poly = next((z.poly for z in zones if z.name=="Entry"), None)
        elif bt == "HOSPITAL":
            entry_poly = next((z.poly for z in zones if "Reception" in z.name), None)
        else:
            entry_poly = next((z.poly for z in zones if z.kind=="public"), None)
        if BUILDING_CONFIGS[bt].get("requires_parking", True) and entry_poly:
            cars = 3 if bt in ["HOSPITAL","SCHOOL"] else 2
            parking = place_driveway(self.land, build, entry_poly, cars=cars)

        return build, zones, corridors, parking

# ---- Door Policy ----
DOOR_POLICY = {
    "HOUSE": {
        "Entry": ["Living", "Kitchen"],
        "Living": ["Entry", "Kitchen", "Dining", "Family / Lounge"],
        "Bedroom": ["Living"],
        "Master Bedroom": ["Living"],
        "Bath": ["Bedroom", "Living"],
        "Kitchen": ["Living", "Pantry / Flex"],
        "Study": ["Living"],
        "Utility": ["Kitchen"]
    },
    "HOSPITAL": {
        "Reception": ["Waiting", "Consultation"], "Waiting": ["Reception", "Consultation"],
        "Consultation": ["Waiting"], "Patient Room": [],
        "ICU": [], "Nurses Station": [],
        "Operating Room": [], "Operating Block": [], "Pharmacy": [],
        "Lab": [], "Radiology": [], "Bathroom": ["Reception", "Patient Room", "ICU"], "Admin": ["Reception"]
    },
    "COMPANY": {
        "Lobby": ["Open Office", "Manager Office"], "Manager Office": ["Lobby", "Open Office"],
        "Open Office": ["Lobby", "Manager Office"], "Meeting Room": ["Lobby"],
        "Conference": [], "Break Room": [], "Bathroom": ["Open Office", "Lobby"], "Storage": [],
        "Print Room": [], "Server Room": [], "IT Room": []
    },
    "SCHOOL": {
        "Admin Office": ["Library"], "Library": ["Admin Office"],
        "Classroom": [], "Classroom Wing": [], "Science Lab": [],
        "Science Lab Block": [], "Computer Lab": [], "Gym": [],
        "Cafeteria": [], "Arts Room": [], "Bathroom": ["Admin Office","Library"], "Storage": []
    }
}

def base_type(name: str) -> str:
    mapping = [
        ("Patient Ward", "Patient Room"),
        ("ICU Unit", "ICU"),
        ("Operating Block", "Operating Room"),
        ("Classroom Wing", "Classroom"),
        ("Science Lab Block", "Science Lab")
    ]
    for key, val in mapping:
        if key in name:
            return val
    tokens = [
        "Bedroom","Bathroom","Bath","Storage","Server Room","Print Room","Manager Office",
        "Open Office","Meeting Room","Conference","Lobby","Reception","Waiting","Consultation",
        "Pharmacy","Lab","Radiology","Nurses Station","Library","Admin Office","Gym","Cafeteria",
        "Arts Room","Study","Kitchen","Dining","Entry","Living","Utility","Science Lab","Classroom"
    ]
    for t in tokens:
        if t in name:
            return t
    return name

def is_target_match(target: str, other_name: str) -> bool:
    if target == "Corridor":
        return False
    bt = base_type(other_name)
    return (target in other_name) or (target == bt)

def max_doors_for(zone_name: str, building_type: str) -> int:
    if building_type == "HOSPITAL" and any(k in zone_name for k in ["Reception","Nurses Station"]):
        return 2
    if building_type == "COMPANY" and any(k in zone_name for k in ["Lobby","Open Office","Manager Office"]):
        return 2
    if building_type == "SCHOOL" and any(k in zone_name for k in ["Admin Office","Library"]):
        return 2
    if building_type == "HOUSE" and any(k in zone_name for k in ["Living","Entry"]):
        return 2
    return 1

# ---- Rendering ----
def enhanced_render(engine: MultiBuildingEngine, zones, build, corridors, parking, output_path, design_num):
    minx,miny,maxx,maxy = engine.land.bounds
    fig, ax = plt.subplots(figsize=((maxx-minx)/2.1, (maxy-miny)/2.1))
    ax.set_xlim(minx-2, maxx+2); ax.set_ylim(miny-2, maxy+2); ax.axis("off")

    lx,ly = engine.land.exterior.xy
    ax.add_patch(patches.Polygon(list(zip(lx,ly)), closed=True, facecolor="#e9f7e9", edgecolor="black", linewidth=3, zorder=5))

    def draw_poly_outline(ax, poly: Polygon, color="#ffffff"):
        if poly.is_empty:
            return
        def _one(g):
            x,y = g.exterior.xy
            ax.add_patch(patches.Polygon(list(zip(x,y)), closed=True, facecolor=color, edgecolor="black", linewidth=3, zorder=8))
        if poly.geom_type == "MultiPolygon":
            for g in poly.geoms:
                _one(g)
        else:
            _one(poly)

    draw_poly_outline(ax, build, "#ffffff")

    def draw_poly(ax, poly: Polygon, label=None, color="#eee", lw=3, z=10, fontsize=9, show_area=False):
        if poly.is_empty:
            return
        def _one(g):
            x,y = g.exterior.xy
            ax.add_patch(patches.Polygon(list(zip(x,y)), closed=True, facecolor=color, edgecolor="black", linewidth=lw, zorder=z))
        if poly.geom_type == "MultiPolygon":
            for g in poly.geoms:
                _one(g)
        else:
            _one(poly)
        if label:
            cx,cy = poly.centroid.coords[0]
            area_text = f"\n{float(poly.area):.1f}m²" if show_area else ""
            ax.text(cx, cy, f"{label}{area_text}", ha="center", va="center", fontsize=fontsize, zorder=z+2, wrap=True)

    for z in zones:
        col = COL.get(z.name, COL.get(z.kind, "#ddd"))
        draw_poly(ax, z.poly, z.name, color=col, lw=3, z=15, show_area=True)

    if parking:
        draw_poly(ax, parking, "Parking", color=COL["Parking"], lw=3, z=12)

    def draw_measurements(ax, build_poly, land_poly):
        minx, miny, maxx, maxy = build_poly.bounds
        ax.plot([minx, maxx], [miny-1, miny-1], 'k-', lw=1, zorder=20)
        ax.plot([minx, minx], [miny-1.2, miny-0.8], 'k-', lw=1, zorder=20)
        ax.plot([maxx, maxx], [miny-1.2, miny-0.8], 'k-', lw=1, zorder=20)
        ax.text((minx+maxx)/2, miny-1.8, f"{maxx-minx:.1f}m", ha='center', va='top', fontsize=8, zorder=20)
        ax.plot([maxx+1, maxx+1], [miny, maxy], 'k-', lw=1, zorder=20)
        ax.plot([maxx+0.8, maxx+1.2], [miny, miny], 'k-', lw=1, zorder=20)
        ax.plot([maxx+0.8, maxx+1.2], [maxy, maxy], 'k-', lw=1, zorder=20)
        ax.text(maxx+1.8, (miny+maxy)/2, f"{maxy-miny:.1f}m", ha='center', va='center', fontsize=8, rotation=90, zorder=20)

    draw_measurements(ax, build, engine.land)

    total_room_area = sum(z.area for z in zones if z.poly and not z.poly.is_empty)
    efficiency = (total_room_area / engine.total_building_area) * 100 if engine.total_building_area > 0 else 0
    summary_text = (f"{engine.building_info['name']} - Design {design_num}\n"
                    f"Building Area: {engine.total_building_area:.1f}m²\n"
                    f"Usable Area: {total_room_area:.1f}m²\n"
                    f"Efficiency: {efficiency:.1f}%")
    ax.text(0.02, 0.98, summary_text, transform=ax.transAxes, va='top', fontsize=10,
            bbox=dict(boxstyle="round,pad=0.3", facecolor="white", alpha=0.8), zorder=30)

    bt = engine.building_type
    policy = DOOR_POLICY.get(bt, {})

    def allowed_targets_for(name: str):
        b = base_type(name)
        return policy.get(b, policy.get(name, []))

    for z in zones:
        max_allowed = max_doors_for(z.name, bt)
        targets = allowed_targets_for(z.name)
        doors_drawn = 0

        if corridors:
            best_seg = None; best_corr = None
            for c in corridors:
                seg = longest_shared_segment(z.poly, c)
                if seg and seg.length > 0.7:
                    if not best_seg or seg.length > best_seg.length:
                        best_seg, best_corr = seg, c
            if best_corr and "Corridor" in targets:
                draw_door_between(ax, z.poly, best_corr)
                doors_drawn += 1
                if doors_drawn >= max_allowed:
                    continue

        candidates = []
        for w in zones:
            if w is z or w.poly.is_empty:
                continue
            if any(is_target_match(t, w.name) for t in targets):
                seg = longest_shared_segment(z.poly, w.poly)
                if seg and seg.length > 0.7:
                    candidates.append((seg.length, w))
        candidates.sort(reverse=True, key=lambda x: x[0])
        used_ids = set()
        for _, w in candidates:
            if doors_drawn >= max_allowed:
                break
            if id(w) in used_ids:
                continue
            draw_door_between(ax, z.poly, w.poly)
            used_ids.add(id(w))
            doors_drawn += 1

        if doors_drawn == 0:
            best_neighbor = None; best_seg = None
            for w in zones:
                if w is z or w.kind == z.kind:
                    continue
                seg = longest_shared_segment(z.poly, w.poly)
                if seg and seg.length > 0.9:
                    if not best_seg or seg.length > best_seg.length:
                        best_seg, best_neighbor = seg, w
            if best_neighbor:
                draw_door_between(ax, z.poly, best_neighbor.poly)

    win_ok = {
        "HOUSE": {"Entry","Living","Dining","Kitchen","Family / Lounge","Master Bedroom","Study","Bedroom"},
        "HOSPITAL": {"Reception","Waiting","Consultation","Patient Room","ICU","Admin"},
        "COMPANY": {"Lobby","Open Office","Manager Office","Meeting Room","Conference","Break Room"},
        "SCHOOL": {"Classroom","Science Lab","Computer Lab","Library","Admin Office","Arts Room"}
    }
    building_windows = win_ok.get(bt, set())
    for z in zones:
        if base_type(z.name) not in building_windows:
            continue
        inter = z.poly.boundary.intersection(build.exterior)
        if inter.is_empty:
            continue
        segs = [inter] if isinstance(inter, LineString) else list(inter.geoms) if isinstance(inter, MultiLineString) else []
        segs = sorted(segs, key=lambda s: s.length, reverse=True)[:2]
        for s in segs:
            if s.length > 1.2:
                base = 1.6
                if "Bedroom" in z.name or "Bath" in z.name:
                    base = 1.2
                draw_window_on_segment(ax, s, size=min(base, s.length*0.5), lw=5, z=35)

    plt.savefig(output_path, dpi=300, bbox_inches='tight', transparent=False)
    plt.close()

    return {
        "building_area": engine.total_building_area,
        "usable_area": total_room_area,
        "efficiency": efficiency,
        "rooms": [{"name": z.name, "area": z.area} for z in zones if z.area > 0]
    }

# ---- Public API ----
def generate_building(building_type="HOUSE", land_shape="rectangle", land_w=None, land_h=None,
                      bedrooms=3, baths=2, with_study=True, budget=None, output_dir=None):
    building_info = BUILDING_TYPES[building_type]
    if land_w is None or land_h is None:
        land_w, land_h = building_info["default_land"]
    if budget is None:
        budget = building_info["default_budget"]

    if output_dir is None:
        output_dir = Path("floorplans_output")
    else:
        output_dir = Path(output_dir)

    output_dir.mkdir(exist_ok=True)

    results = []
    for i in range(6):
        use_seed = random.randint(1, 99999)
        eng = MultiBuildingEngine(building_type, land_shape, land_w, land_h, budget, use_seed)
        build, zones, corridors, parking = eng.layout(bedrooms, baths, with_study)

        output_path = output_dir / f"{i+1}.png"
        stats = enhanced_render(eng, zones, build, corridors, parking, output_path, i+1)

        results.append({
            "design_number": i+1,
            "image_path": str(output_path),
            "statistics": stats
        })

        print(f"✅ Design {i+1}/6 saved: {output_path}")

    # Save metadata
    metadata = {
        "building_type": building_type,
        "land_shape": land_shape,
        "land_dimensions": {"width": land_w, "height": land_h},
        "budget": budget,
        "designs": results
    }

    metadata_path = output_dir / "metadata.json"
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"\n🎉 All 6 designs generated successfully!")
    print(f"📁 Metadata saved: {metadata_path}")

    return results
if __name__ == "__main__":
    import sys
    import io
    import argparse

    # Fix Windows Unicode encoding issues
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

    # Parse command line arguments using argparse
    parser = argparse.ArgumentParser(description='Generate building floorplans')
    parser.add_argument('--projectType', type=str, required=True, help='Building type')
    parser.add_argument('--budget', type=float, required=True, help='Project budget')
    parser.add_argument('--floors', type=int, default=1, help='Number of floors')
    parser.add_argument('--area', type=float, required=True, help='Land area')
    parser.add_argument('--areaUnit', type=str, default='m2', help='Area unit')
    parser.add_argument('--imagePath', type=str, help='Image path')
    parser.add_argument('--shape', type=str, required=True, help='Land shape')

    args = parser.parse_args()

    building_type = args.projectType.upper()
    land_shape = args.shape.lower()
    land_size = args.area
    budget = args.budget

    # Calculate land dimensions from area
    ratio = 1.7
    land_h = math.sqrt(land_size / ratio)
    land_w = ratio * land_h

    print(f"Input: Type={building_type}, Shape={land_shape}, Size={land_w:.1f}×{land_h:.1f}m, Budget=${budget:,.0f}")

    # Create output directory based on timestamp
    import time
    output_dir = f"floorplans_output_{int(time.time())}"

    generate_building(building_type, land_shape, land_w, land_h, 3, 2, True, budget, output_dir)