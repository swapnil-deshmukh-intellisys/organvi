# Blog Images Requirements

## Summary
- **Total Blogs**: 12
- **Images per Blog**: 3 images (1 main + 2 additional)
- **Total Images Needed**: 36 images (but many are reused across blogs)

---

## Image Requirements Per Blog

Each blog post requires:
1. **1 Main/Featured Image** - Used in:
   - Blog listing page (card thumbnail)
   - Blog detail page (main hero image)
   - Recent posts section (if shown)

2. **2 Additional Images** - Used in:
   - Blog detail page (shown in a 3-image grid below the content)

**Total: 3 images per blog post**

---

## Complete List of Image Names Required

### Currently Used Images (18 unique images):

#### PNG Images:
1. `Coffee_new.png`
2. `almond.png`
3. `spices.png`
4. `dryfruits.png`
5. `jeggary.png`
6. `fssai.png`
7. `Pure_jaggary.png`
8. `iso.png`

#### JPG Images:
9. `dryfruitshero.jpg`
10. `pulseshero.jpg`
11. `jaggary2.jpg`

#### GIF Images:
12. `ploughing.gif`
13. `harvesting.gif`
14. `nutrient.gif`
15. `sowing.gif`
16. `irrigation.gif`
17. `protecting.gif`
18. `storage.gif`

---

## Image Distribution by Blog Post

### Blog 1: "Embracing Innovation in Coffee Farming with AGRIVI FMS"
- Main: `Coffee_new.png`
- Additional: `harvesting.gif`, `irrigation.gif`

### Blog 2: "This Is How AI Advisors Can Support Food Brands..."
- Main: `dryfruitshero.jpg`
- Additional: `storage.gif`, `protecting.gif`

### Blog 3: "AI-Powered Sales & Marketing: The Competitive Edge..."
- Main: `ploughing.gif`
- Additional: `sowing.gif`, `nutrient.gif`

### Blog 4: "A Story from Tequila Fields: How Data is Reshaping..."
- Main: `harvesting.gif`
- Additional: `irrigation.gif`, `protecting.gif`

### Blog 5: "Discover Four Big Food & Beverage AI Use Cases..."
- Main: `nutrient.gif`
- Additional: `storage.gif`, `Coffee_new.png`

### Blog 6: "How LTD Almond Uses AGRIVI to Improve Sustainability..."
- Main: `almond.png`
- Additional: `irrigation.gif`, `nutrient.gif`

### Blog 7: "The Future of Organic Farming: Technology Meets Tradition"
- Main: `sowing.gif`
- Additional: `ploughing.gif`, `harvesting.gif`

### Blog 8: "Sustainable Spice Production: A Guide to Organic Spice Farming"
- Main: `spices.png`
- Additional: `harvesting.gif`, `storage.gif`

### Blog 9: "Pulse Production: Maximizing Yields Through Smart Farming..."
- Main: `pulseshero.jpg`
- Additional: `sowing.gif`, `harvesting.gif`

### Blog 10: "Dry Fruits and Nuts: The Complete Guide to Organic Production"
- Main: `dryfruits.png`
- Additional: `almond.png`, `storage.gif`

### Blog 11: "Sweetener Alternatives: Exploring Natural and Organic Options"
- Main: `jeggary.png`
- Additional: `Pure_jaggary.png`, `jaggary2.jpg`

### Blog 12: "The Complete Guide to Organic Certification..."
- Main: `fssai.png`
- Additional: `iso.png`, `harvesting.gif`

---

## Image File Location

All images should be placed in:
```
organvi/organvi/src/assets/
```

---

## Image Specifications (Recommended)

### Main/Featured Images:
- **Format**: PNG, JPG, or GIF
- **Recommended Size**: 1200x800px (or similar 3:2 aspect ratio)
- **File Size**: Under 500KB for optimal loading

### Additional Images:
- **Format**: PNG, JPG, or GIF
- **Recommended Size**: 800x600px (or similar 4:3 aspect ratio)
- **File Size**: Under 300KB each

---

## Notes

1. **Image Reuse**: Many images are reused across multiple blog posts (e.g., `harvesting.gif` is used in 5 different blogs). This is intentional and helps maintain consistency.

2. **Image Types**: 
   - Static images (PNG/JPG) are used for product photos and illustrations
   - Animated GIFs are used for process demonstrations (ploughing, sowing, harvesting, etc.)

3. **Adding New Blogs**: When adding new blog posts, ensure:
   - The main image is added to the `imageMap` in `src/utils/imageImports.js`
   - All 3 images (main + 2 additional) are specified in the blog data
   - Images are placed in the `src/assets/` folder

---

## Current Status

✅ All 18 unique images are already imported and mapped in `src/utils/imageImports.js`
✅ All 12 blogs have their 3 images configured
✅ Images are properly referenced in the blog data

