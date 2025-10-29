# ImageKit Auto-Fetch Setup Guide

Your website now automatically fetches wallpapers from ImageKit! No more manual code editing required.

## 📋 **How It Works**

1. Upload images to ImageKit (via dashboard)
2. Organize them in folders (folders = categories)
3. Your website automatically fetches and displays them
4. Updates appear within 1 hour (or instantly with cache clear)

---

## 🎯 **Quick Start**

### **Step 1: Create Folder Structure in ImageKit**

Go to your [ImageKit Dashboard](https://imagekit.io/dashboard) and create this folder structure:

```
/wallpapers/
  ├── /Abstract/
  ├── /Art/
  ├── /Minimalist/
  ├── /Fantasy/
  ├── /Nature/
  ├── /Space/
  ├── /Technology/
  └── /Other/
```

**Note**: Folder names become categories automatically!

---

### **Step 2: Upload Wallpapers**

1. Go to **Media Library** in ImageKit dashboard
2. Navigate to the appropriate folder (e.g., `/wallpapers/Abstract/`)
3. Click **Upload** or drag & drop images
4. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

**Recommended Settings:**
- Image size: At least 1920x1080 (Full HD)
- Quality: High (will be optimized by ImageKit)
- File names: Use descriptive names (e.g., `sunset-mountains.jpg`)

---

### **Step 3: Add Metadata (Optional but Recommended)**

For better titles and descriptions, add **Custom Metadata** in ImageKit:

1. Click on an image in ImageKit
2. Go to **Details** tab
3. Scroll to **Custom Metadata**
4. Add these fields:

| Field | Value Example | Required? |
|-------|---------------|-----------|
| `title` | "Beautiful Sunset Over Mountains" | No (uses filename if missing) |
| `description` | "A stunning sunset with vibrant colors..." | No (auto-generated if missing) |
| `source` | "pexels" or "unsplash" | No (defaults to "imagekit") |
| `sourceUrl` | "https://pexels.com/photo/123456" | No |

---

### **Step 4: Wait or Clear Cache**

**Option A: Wait (Recommended)**
- Wallpapers appear automatically within 1 hour
- Cache ensures fast loading for users

**Option B: Clear Cache (Instant Update)**
- Make a POST request to: `/api/wallpapers/sync`
- Using curl:
  ```bash
  curl -X POST http://localhost:3000/api/wallpapers/sync
  ```
- Or use Postman, Thunder Client, etc.
- Next page load will fetch fresh data

---

## 🎨 **How Categories Work**

Categories are automatically detected from your folder structure:

| ImageKit Folder | Category on Website |
|-----------------|---------------------|
| `/wallpapers/Abstract/image.jpg` | "Abstract" |
| `/wallpapers/Art/painting.jpg` | "Art" |
| `/wallpapers/Nature/forest.jpg` | "Nature" |

**Add New Categories:**
1. Create new folder in `/wallpapers/`
2. Upload images to it
3. Category automatically appears on website!

---

## 📝 **File Naming Best Practices**

Your filename becomes the default title if no custom metadata is set:

**Bad:**
- `IMG_1234.jpg` → "Img 1234"
- `wallpaper.jpg` → "Wallpaper"

**Good:**
- `sunset-ocean-beach-4k.jpg` → "Sunset Ocean Beach 4k"
- `abstract-geometric-pattern.jpg` → "Abstract Geometric Pattern"
- `mountain-landscape-minimal.jpg` → "Mountain Landscape Minimal"

---

## ⚡ **Caching Strategy**

**How it works:**
- First visitor: Fetches from ImageKit (2-3 seconds)
- Cache duration: 1 hour
- Next visitors: Instant load from cache
- Cache auto-refreshes every hour

**Benefits:**
- ✅ Fast page loads
- ✅ Reduces ImageKit API calls
- ✅ Stays within free tier limits
- ✅ Automatic updates

---

## 🔍 **Troubleshooting**

### **Wallpapers not showing up?**

1. **Check folder structure**
   - Folder must be `/wallpapers/` (lowercase)
   - Images must be in subfolders, not root

2. **Check file formats**
   - Only `.jpg`, `.jpeg`, `.png`, `.webp` are supported
   - Other formats are ignored

3. **Check API response**
   - Open browser console
   - Look for: `✅ Loaded X wallpapers from ImageKit`
   - If you see `ℹ️ Using fallback wallpapers`, check your ImageKit setup

4. **Clear cache**
   ```bash
   curl -X POST http://localhost:3000/api/wallpapers/sync
   ```

### **Images showing as broken?**

1. **Check image paths**
   - Go to ImageKit dashboard
   - Verify the file path includes `/wallpapers/`

2. **Check next.config.js**
   - `ik.imagekit.io` should be in `remotePatterns`

3. **Check environment variables**
   - `NEXT_PUBLIC_IMAGEKIT_ENDPOINT` is set correctly
   - No trailing slash in the endpoint

---

## 📊 **API Limits (Free Tier)**

ImageKit Free Tier:
- 20 GB bandwidth/month
- 20,000 API requests/month

**Your usage (estimated):**
- Monthly wallpaper uploads: ~10-20 images = ~20 API calls
- Website visitors: 10,000/month
- With 1-hour cache: ~720 API calls/month
- **Total: ~740 API calls/month** (well within free tier!)

---

## 🎯 **Adding Wallpapers - Quick Checklist**

- [ ] Upload image to ImageKit
- [ ] Place in correct folder (e.g., `/wallpapers/Abstract/`)
- [ ] Use descriptive filename
- [ ] (Optional) Add custom metadata
- [ ] (Optional) Add tags for better organization
- [ ] Wait 1 hour OR clear cache for instant update
- [ ] Verify on website

---

## 🚀 **Advanced Tips**

### **Bulk Upload**
1. Prepare all images locally in folders
2. Use ImageKit's bulk upload feature
3. Upload entire folder structure at once

### **Image Optimization**
- ImageKit automatically optimizes images
- Serves WebP format to supported browsers
- Lazy loading is built-in
- Responsive images based on device

### **Tags for Organization**
In ImageKit, add tags to images:
- `featured` - for featured wallpapers
- `4k` - for 4K resolution
- `popular` - for trending wallpapers

(Future feature: filter by tags on website)

---

## 📞 **Need Help?**

If wallpapers aren't showing up:
1. Check browser console for errors
2. Verify ImageKit folder structure
3. Test the API endpoint: `GET /api/wallpapers/sync`
4. Check that ImageKit credentials are in `.env.local`

---

## ✅ **You're All Set!**

Now you can manage wallpapers entirely through ImageKit:
- ✅ No code changes needed
- ✅ No deployments required
- ✅ Auto-categorization
- ✅ Fast & cached
- ✅ Scalable to 1000s of wallpapers

Happy uploading! 🎉

