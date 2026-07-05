# -*- coding: utf-8 -*-
"""
import-feed.py – konverterer en produktfeed (CSV) fra Adtraction/Awin
til katalog.js som Stilvelger-appen leser automatisk.

Bruk:
    python import-feed.py feed.csv --butikk "Zalando"
    python import-feed.py feed.csv --butikk "Boozt" --maks 200

Feeden må være CSV (Adtraction og Awin kan eksportere det). Skriptet
finner selv de riktige kolonnene (navn, pris, bilde, lenke) uansett om
kolonnene heter "ProductName", "product_name", "aw_product_name" osv.
Plaggtype, farge, stil og anledning gjettes ut fra produktnavnet, slik
at matche-motoren i appen fungerer på ekte produkter også.
"""
import argparse
import csv
import json
import re
import sys
from pathlib import Path

# ---------- Kolonnenavn brukt av ulike nettverk ----------
COLUMN_ALIASES = {
    "navn":  ["productname", "product_name", "aw_product_name", "name", "title", "produktnavn"],
    "pris":  ["price", "search_price", "produktpris", "pris", "display_price"],
    "bilde": ["imageurl", "image_url", "aw_image_url", "merchant_image_url", "image", "bilde"],
    "url":   ["producturl", "product_url", "aw_deep_link", "trackingurl", "tracking_url", "deeplink", "url", "link"],
    "butikk": ["programname", "advertiser", "merchant_name", "brand", "butikk"],
    "kategori": ["category", "merchant_category", "category_name", "kategori"],
}

# ---------- Plaggtype ut fra nøkkelord i navn/kategori ----------
# (nøkkelord, kategori i appen, tegning, stiler, anledninger)
TYPE_RULES = [
    (r"kjole|\bdress\b",                 "kjole",    "kjole",      ["smart"],                       ["fest", "date"]),
    (r"skjørt|skirt",                    "underdel", "skjort",     ["smart"],                       ["jobb", "date", "fest"]),
    (r"bluse|blouse",                    "overdel",  "bluse",      ["smart", "klassisk"],           ["jobb", "date", "fest"]),
    (r"\btopp\b|\btop\b|singlet",        "overdel",  "topp",       ["smart", "casual"],             ["fest", "date", "hverdag"]),
    (r"pumps|høye? hæler|heels|ballerina", "sko",    "pumps",      ["klassisk", "smart"],           ["fest", "jobb", "date"]),
    (r"veske|håndveske|\bbag\b",         "tilbehor", "veske",      ["smart"],                       ["fest", "jobb", "date", "hverdag"]),
    (r"leggings|tights",                 "underdel", "joggebukse", ["sporty"],                      ["aktiv", "hverdag"]),
    (r"hoodie|hettegenser",              "overdel",  "hoodie",     ["street", "casual"],            ["kompiser", "hverdag"]),
    (r"t-?skjorte|t-?shirt|tee\b",       "overdel",  "tskjorte",   ["casual", "street"],            ["kompiser", "hverdag", "date"]),
    (r"pique|polo",                      "overdel",  "pique",      ["smart", "klassisk"],           ["kompiser", "jobb", "date"]),
    (r"overshirt|skjortejakke",          "overdel",  "overshirt",  ["casual", "street"],            ["kompiser", "hverdag"]),
    (r"skjorte|shirt",                   "overdel",  "skjorte",    ["smart", "klassisk"],           ["kompiser", "jobb", "date", "fest"]),
    (r"genser|sweater|strikk|knit|sweatshirt", "overdel", "genser", ["smart", "casual"],            ["hverdag", "jobb", "date"]),
    (r"joggebukse|sweatpants|track ?pants", "underdel", "joggebukse", ["sporty", "street", "casual"], ["aktiv", "hverdag"]),
    (r"shorts",                          "underdel", "shorts",     ["casual"],                      ["hverdag", "kompiser"]),
    (r"jeans|denim.*(bukse|pants)",      "underdel", "bukse",      ["casual", "smart", "street"],   ["kompiser", "hverdag", "date", "fest"]),
    (r"chinos|bukse|trousers|pants",     "underdel", "bukse",      ["smart", "casual"],             ["kompiser", "jobb", "date"]),
    (r"sneaker|joggesko|trainers",       "sko",      "sneaker",    ["casual", "street", "sporty"],  ["kompiser", "hverdag", "fest"]),
    (r"boots|støvle|chelsea",            "sko",      "boots",      ["smart", "klassisk"],           ["fest", "jobb", "date"]),
    (r"loafer|mokasin",                  "sko",      "loafer",     ["klassisk", "smart"],           ["jobb", "date", "fest"]),
    (r"\bsko\b|shoe",                    "sko",      "sneaker",    ["casual", "smart"],             ["kompiser", "hverdag"]),
    (r"blazer|dressjakke",               "yttertoy", "blazer",     ["klassisk", "smart"],           ["jobb", "fest", "date"]),
    (r"frakk|coat|parkas|kåpe",          "yttertoy", "frakk",      ["klassisk", "smart"],           ["jobb", "date"]),
    (r"jakke|jacket|bomber",             "yttertoy", "jakke",      ["casual", "street"],            ["kompiser", "hverdag"]),
    (r"caps|\bcap\b|lue",                "tilbehor", "caps",       ["street", "casual"],            ["hverdag", "kompiser"]),
    (r"belte|belt",                      "tilbehor", "belte",      ["smart", "klassisk"],           ["jobb", "date", "fest", "kompiser"]),
    (r"klokke|watch",                    "tilbehor", "klokke",     ["klassisk", "smart"],           ["jobb", "date", "fest"]),
]

# ---------- Farge ut fra nøkkelord (mest spesifikke først) ----------
COLOR_RULES = [
    (r"lyse?blå|light blue",   "lysbla"),
    (r"marineblå|marine|navy", "marine"),
    (r"mørk.?blå|denim|jeans", "denim"),
    (r"blå|blue",              "bla"),
    (r"lyse?grå|light gr[ea]y","lysgra"),
    (r"grå|gr[ea]y",           "gra"),
    (r"sort|svart|black",      "sort"),
    (r"hvit|white|offwhite",   "hvit"),
    (r"beige|sand|khaki|krem", "beige"),
    (r"brun|brown|cognac",     "brun"),
    (r"oliven|olive|army",     "oliven"),
    (r"grønn|green",           "gronn"),
    (r"burgunder|bordeaux|vinrød", "burgunder"),
    (r"rød|red",               "rod"),
    (r"rosa|pink",             "rosa"),
    (r"gul|yellow|sennep|mustard", "gul"),
]

def finn_kolonne(felter, alias_liste):
    """Finn kolonnenavnet i feeden som matcher et av aliasene."""
    lave = {f.lower().strip(): f for f in felter}
    for alias in alias_liste:
        if alias in lave:
            return lave[alias]
    return None

def gjett_type(tekst):
    for monster, cat, typ, stiler, anledninger in TYPE_RULES:
        if re.search(monster, tekst):
            return cat, typ, stiler, anledninger
    return None

def gjett_farge(tekst):
    for monster, farge in COLOR_RULES:
        if re.search(monster, tekst):
            return farge
    return "gra"  # trygg nøytral standard

def gjett_kjonn(tekst):
    if re.search(r"dame|women|woman|kvinne|lady|femme|kjole|skjørt|bluse", tekst):
        return "dame"
    if re.search(r"herre|\bmen\b|\bman\b|homme|\bmens\b", tekst):
        return "herre"
    return "unisex"

def parse_pris(raatekst):
    """'599.00 NOK' / '1 299,50' / '499' -> heltall kroner"""
    tall = re.sub(r"[^\d,\.]", "", raatekst or "").replace(",", ".")
    deler = tall.split(".")
    if len(deler) > 2:  # tusenskilletegn: 1.299.00
        tall = "".join(deler[:-1]) + "." + deler[-1]
    try:
        return round(float(tall))
    except ValueError:
        return None

def main():
    p = argparse.ArgumentParser(description="Konverter produktfeed (CSV) til katalog.js")
    p.add_argument("feedfil", help="CSV-fil fra Adtraction/Awin")
    p.add_argument("--butikk", default=None, help="Butikknavn hvis feeden mangler det (f.eks. Zalando)")
    p.add_argument("--maks", type=int, default=500, help="Maks antall produkter (standard 500)")
    args = p.parse_args()

    sti = Path(args.feedfil)
    if not sti.exists():
        sys.exit(f"Finner ikke fila: {sti}")

    innhold = sti.read_text(encoding="utf-8-sig", errors="replace")
    skilletegn = ";" if innhold.splitlines()[0].count(";") > innhold.splitlines()[0].count(",") else ","
    rader = list(csv.DictReader(innhold.splitlines(), delimiter=skilletegn))
    if not rader:
        sys.exit("Feeden er tom.")

    felter = rader[0].keys()
    kol = {n: finn_kolonne(felter, aliaser) for n, aliaser in COLUMN_ALIASES.items()}
    if not kol["navn"] or not kol["url"]:
        sys.exit(f"Fant ikke navn/lenke-kolonner. Kolonner i feeden: {', '.join(felter)}")

    produkter, hoppet_over = [], 0
    for n, rad in enumerate(rader[: args.maks], start=1):
        navn = (rad.get(kol["navn"]) or "").strip()
        url = (rad.get(kol["url"]) or "").strip()
        pris = parse_pris(rad.get(kol["pris"], "") if kol["pris"] else "")
        if not navn or not url or pris is None:
            hoppet_over += 1
            continue

        soketekst = f"{navn} {rad.get(kol['kategori'], '') if kol['kategori'] else ''}".lower()
        typeinfo = gjett_type(soketekst)
        if typeinfo is None:  # ikke et plagg vi kjenner igjen (f.eks. parfyme)
            hoppet_over += 1
            continue
        cat, typ, stiler, anledninger = typeinfo

        produkter.append({
            "id": f"f{n}",
            "navn": navn,
            "cat": cat,
            "type": typ,
            "color": gjett_farge(soketekst),
            "kjonn": gjett_kjonn(soketekst),
            "styles": stiler,
            "occ": anledninger,
            "pris": pris,
            "url": url,
            "butikk": (rad.get(kol["butikk"]) or "").strip() if kol["butikk"] else (args.butikk or "Nettbutikk"),
            "img": (rad.get(kol["bilde"]) or "").strip() if kol["bilde"] else "",
        })

    ut = Path(__file__).parent / "katalog.js"
    js = json.dumps(produkter, ensure_ascii=False, indent=2)
    ut.write_text(
        "// Generert av import-feed.py – ikke rediger for hånd.\n"
        f"// Kilde: {sti.name} ({len(produkter)} produkter)\n"
        f"const FEED_ITEMS = {js};\n",
        encoding="utf-8",
    )
    print(f"Ferdig! {len(produkter)} produkter skrevet til katalog.js ({hoppet_over} rader hoppet over).")

if __name__ == "__main__":
    main()
