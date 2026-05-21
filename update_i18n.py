import re
import sys

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Read translations
    with open("translations.txt", "r", encoding="utf-8") as f:
        trans_text = f.read()
    
    tj_trans = trans_text.split("=== TJ ===")[1].split("=== RU ===")[0].strip()
    ru_trans = trans_text.split("=== RU ===")[1].split("=== EN ===")[0].strip()
    en_trans = trans_text.split("=== EN ===")[1].strip()

    # Inject into tj: { ... }
    content = re.sub(r'(tj:\s*\{.*?)(\n\s*\},)', r'\1\n    // Categories\n' + tj_trans + r'\2', content, flags=re.DOTALL)
    content = re.sub(r'(ru:\s*\{.*?)(\n\s*\},)', r'\1\n    // Categories\n' + ru_trans + r'\2', content, flags=re.DOTALL)
    content = re.sub(r'(en:\s*\{.*?)(\n\s*\},)', r'\1\n    // Categories\n' + en_trans + r'\2', content, flags=re.DOTALL)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

process_file("src/lib/i18n.ts")
print("Done")
