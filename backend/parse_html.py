import re
import json

with open('../ClueCraft1.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if css_match:
    with open('../frontend/src/index.css', 'w', encoding='utf-8') as f:
        f.write(css_match.group(1))

# Extract SVGs
svs_match = re.search(r'const SCENE_SVGS = \{(.*?)\};\n\n//', html, re.DOTALL)
if svs_match:
    svg_content = svs_match.group(1)
    with open('../frontend/src/svgs.js', 'w', encoding='utf-8') as f:
        f.write("export const SCENE_SVGS = {" + svg_content + "};\n")

# Extract CASES data for backend DB
cases_match = re.search(r'const CASES = (\[.*?\]);\n\n//', html, re.DOTALL)
cases = []
if cases_match:
    import ast
    cases_str = cases_match.group(1)
    # The string is raw JS which has single quotes, unquoted keys, so evaluating might be tricky.
    # We can just let the script dump it directly to a JS file for default cases.
    with open('../frontend/src/defaultCases.js', 'w', encoding='utf-8') as f:
        f.write("export const defaultCases = " + cases_str + ";\n")

print("Parsing successful.")
