import csv
import os

data_dir = os.path.dirname(__file__)

# Read products.csv and create name -> id mapping
product_id_map = {}
product_id = 119

with open(os.path.join(data_dir, 'products.csv'), 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        product_name = row['name']
        
        # Skip id 135
        if product_id == 135:
            product_id += 1
        
        product_id_map[product_name] = product_id
        product_id += 1

print(f"Mapped {len(product_id_map)} products")

# Read product_images.csv and add product_id
output_rows = []
with open(os.path.join(data_dir, 'product_images.csv'), 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        product_name = row['product_name']
        image_url = row['image_url']
        
        # Find product_id
        if product_name in product_id_map:
            product_id = product_id_map[product_name]
            output_rows.append({
                'product_id': product_id,
                'image_url': image_url
            })
        else:
            print(f"Warning: Product not found: {product_name}")

# Write new product_images.csv with product_id
with open(os.path.join(data_dir, 'product_images_with_ids.csv'), 'w', newline='', encoding='utf-8') as f:
    fieldnames = ['product_id', 'image_url']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(output_rows)

print(f"Created product_images_with_ids.csv with {len(output_rows)} images")