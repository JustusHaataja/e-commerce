import requests
from bs4 import BeautifulSoup
import time
import csv

BASE_URL = "https://www.puhdistamo.fi"

CATEGORY_URLS = [
    "/collections/energiajuoma",
    "/collections/elektrolyyttijauhe",
    "/collections/kombucha",
    "/collections/proteiinit-kaikki"
]

def get_soup(url):
    response = requests.get(url)
    response.raise_for_status()
    
    return BeautifulSoup(response.text, "html.parser")


def get_product_links(category_url):
    soup = get_soup(BASE_URL + category_url)
    links = []

    for a in soup.select("a.product-item-meta__title"):
        
        href = a.get("href")
        if href and href.startswith("/products/"):
            links.append(BASE_URL + href)
    
    return links


def parse_product(product_url, category):
    soup = get_soup(product_url)

    # Name
    name_tag = soup.select_one("h1.product-meta__title")
    name = name_tag.get_text(strip=True) if name_tag else ""

    # Price
    price_container = soup.select_one("div.price-list")

    # Initialize variables
    sale_price = ""
    normal_price = ""

    if price_container:
        # Look for the highlighted price (sale or main)
        highlight_tag = price_container.select_one("span.price--highlight")
        normal_tag = price_container.select_one("span.price--compare")

        if highlight_tag and normal_tag:
            # Sale case: highlight is sale, compare is normal
            sale_price = highlight_tag.get_text(strip=True).replace("€","").replace(",",".").replace("Alennushinta","")
            normal_price = normal_tag.get_text(strip=True).replace("€","").replace(",",".").replace("Normaalihinta","")
        else:
            # Regular price case: only one price
            price_tag = price_container.select_one("span.price")
            if price_tag:
                normal_price = price_tag.get_text(strip=True).replace("€","").replace(",",".").replace("Alennushinta","")

    # Images
    images = []
    for img_tag in soup.select("div.product__media-image-wrapper img"):
        src = img_tag.get("src")
        if src and src.startswith("//"):
            src = "https" + src
        images.append(src)

    # FAQ Accordian
    faq = soup.select(".faqAccordion")
    description = ""
    nutrition = ""
    ingredients = ""

    if faq:
        # description
        bullet_div = soup.select_one("div.tuote-bulletit ul")
        if bullet_div:
            bullets = [li.get_text(strip=True) for li in bullet_div.select("li")]
            description = ",".join(bullets)

        # nutrition table
        table_tag = faq[0].select_one("table")
        if table_tag:
            nutrition = "\n".join(["\t".join([td.get_text(strip=True) for td in tr.select("td")])
                                   for tr in table_tag.select("tr")])
            nutrition = nutrition.replace("\t", ", ").replace(" ","").replace("\n","|")

    return {
        "name": name,
        "price": (sale_price.strip(), normal_price.strip()),
        "images": images,
        "description": description,
        "nutrition": nutrition,
        "category": category
    }


def scrape_all():
    all_products = []

    for cat_url in CATEGORY_URLS:
        category = cat_url.replace("/collections/","")
        product_links = get_product_links(cat_url)
        
        for link in product_links:
            print("Sraping:", link)
            try:
                data = parse_product(link, category)
                all_products.append(data)
                time.sleep(1)
            except Exception as e:
                print("Error scraping", link, e)
    
    return all_products


def save_to_csv(products, filename="products.csv"):
    category_map = {
        "energiajuoma": 1,
        "elektrolyyttijauhe": 2,
        "kombucha": 3,
        "proteiinit-kaikki": 4
    }

    # Save products
    keys = ["name", "category_id", "sale_price", "price", "description", "nutrition"]
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        for p in products:
            writer.writerow({
                "name": p["name"],
                "category_id": category_map.get(p["category"], None),
                "sale_price": p["price"][0],
                "price": p["price"][1],
                "description": p["description"],
                "nutrition": p["nutrition"]
            })

    # Save product images with product_name as reference (will be matched later)
    image_keys = ["product_name", "image_url"]
    with open("product_images.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=image_keys)
        writer.writeheader()
        for p in products:
            for img in p["images"]:
                writer.writerow({
                    "product_name": p["name"],
                    "image_url": img
                })


if __name__ == "__main__":
    products = scrape_all()
    save_to_csv(products)
    print("Done! Scraped", len(products), "products.")