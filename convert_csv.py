import csv
import sys
import re

input_file = "catalog_products (2).csv"
output_file = "import_ready_products.csv"

# Target structure
# title,author,isbn,categoryName,price,stock,language,ribbon,description,publisher,coverImage,sortOrder

try:
    with open(input_file, mode='r', encoding='utf-8-sig') as infile:
        reader = csv.DictReader(infile)
        
        with open(output_file, mode='w', encoding='utf-8', newline='') as outfile:
            writer = csv.writer(outfile)
            # Write header
            writer.writerow(['title', 'author', 'isbn', 'categoryName', 'price', 'stock', 'language', 'ribbon', 'description', 'publisher', 'coverImage', 'sortOrder'])
            
            sort_order = 0
            for row in reader:
                # 1. title
                title = row.get('name', '')
                
                # 2. author, publisher, language
                author = ""
                publisher = ""
                language = ""
                
                for i in range(1, 7):
                    title_key = f'additionalInfoTitle{i}'
                    desc_key = f'additionalInfoDescription{i}'
                    
                    info_title = row.get(title_key, '').strip()
                    info_desc = row.get(desc_key, '').strip()
                    
                    if info_title.lower() == 'author':
                        author = info_desc
                    elif info_title.lower() == 'publisher':
                        publisher = info_desc
                    elif info_title.lower() == 'language':
                        language = info_desc
                        
                # 3. isbn
                isbn = row.get('sku', '')
                
                # 4. categoryName
                collection = row.get('collection', '')
                # Replace ; with ,
                category_name = collection.replace(';', ',')
                
                # 5. price
                price = row.get('price', '0')
                
                # 6. stock
                stock = row.get('inventory', '0')
                if stock.strip() == '' or stock.lower() == 'in stock':
                     stock = '10' # default to 10 if not specified
                
                # 7. ribbon
                ribbon = row.get('ribbon', '')
                
                # 8. description
                description = row.get('description', '')
                
                # 9. coverImage
                img = row.get('productImageUrl', '')
                cover_image = ""
                if img:
                    cover_image = f"https://static.wixstatic.com/media/{img}"
                
                # 10. sortOrder
                current_sort_order = sort_order
                sort_order += 1
                
                # Only include products (not variants if they are on separate rows, though handleId implies they are variants)
                field_type = row.get('fieldType', '')
                if field_type == 'Product':
                    writer.writerow([
                        title,
                        author,
                        isbn,
                        category_name,
                        price,
                        stock,
                        language,
                        ribbon,
                        description,
                        publisher,
                        cover_image,
                        current_sort_order
                    ])
                    
    print("Conversion completed successfully!")
except Exception as e:
    print(f"Error: {e}")
