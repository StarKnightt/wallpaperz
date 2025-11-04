# 💰 AdSense Integration Guide

## 🎯 Where to Place Ads (Best Practices)

### 1. **Between Wallpaper Rows** (Recommended)
Place an ad unit every 8-12 wallpapers in the grid.

**Best performing**: Responsive display ads (728x90 on desktop, 320x100 on mobile)

### 2. **Sidebar** (Desktop Only)
- 300x600 (Half Page)
- 300x250 (Medium Rectangle)

### 3. **Top Banner** (Below Header)
- 728x90 (Leaderboard) - Desktop
- 320x50 (Mobile Banner) - Mobile

### 4. **In-Feed Ads** (Native)
- Blend with wallpaper cards
- Best for user experience

---

## 📝 Implementation Steps

### Step 1: Get Your AdSense Code

1. Go to your AdSense dashboard: https://www.google.com/adsense
2. Click "Ads" → "By site" → "+ New ad unit"
3. Choose "Display ads"
4. Name it: "Wallpaperz - Auto Ads"
5. Copy the code

### Step 2: Add Auto Ads Script

Add this to `app/layout.tsx` in the `<head>` section:

```typescript
// app/layout.tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### Step 3: Create Ad Component

```typescript
// components/AdSense.tsx
"use client"

import { useEffect } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
  adLayout?: string
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  adLayout,
}: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className="ad-container my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        {...(adLayout && { 'data-ad-layout': adLayout })}
      />
    </div>
  )
}
```

### Step 4: Use in Homepage

```typescript
// app/page.tsx
import AdSense from '@/components/AdSense'

// In your grid rendering:
<div className="space-y-8">
  <WallpaperGrid 
    wallpapers={displayedWallpapers.slice(0, 8)} 
    onPreview={handlePreview}
  />
  
  {/* Ad after first 8 wallpapers */}
  <AdSense 
    adSlot="YOUR_AD_SLOT_ID" 
    adFormat="horizontal"
  />
  
  <WallpaperGrid 
    wallpapers={displayedWallpapers.slice(8, 16)} 
    onPreview={handlePreview}
  />
  
  {/* Ad after next 8 wallpapers */}
  <AdSense 
    adSlot="YOUR_AD_SLOT_ID_2" 
  />
</div>
```

---

## ⚡ Quick Start (Easiest Method)

### Use Auto Ads (Recommended for Beginners)

1. In AdSense dashboard: "Ads" → "Auto ads"
2. Toggle ON for your site
3. Add this ONE line to `app/layout.tsx`:

```typescript
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

**That's it!** Google will automatically place ads for you.

---

## 🎨 Ad Placement Best Practices

### ✅ DO:
- Place ads between content (every 8-12 wallpapers)
- Use responsive ad units
- Match ad colors to your theme
- Leave space around ads (margin)
- Test different placements

### ❌ DON'T:
- Place more than 3 ads per page initially
- Put ads above the fold only
- Use deceptive ad labels
- Click your own ads (instant ban!)
- Ask users to click ads

---

## 📊 Expected Revenue

### Conservative Estimates:
- **500 visitors/day**: $2-5/day ($60-150/month)
- **1000 visitors/day**: $5-15/day ($150-450/month)
- **2000 visitors/day**: $10-30/day ($300-900/month)
- **5000 visitors/day**: $30-100/day ($900-3000/month)

**Factors affecting revenue:**
- Geography (US/UK/Canada = higher RPM)
- Content category (Tech = higher CPM)
- Ad placement
- User engagement time
- Device type

---

## 🚀 When to Enable Ads?

**Option 1: NOW** (Recommended)
- Enable Auto Ads today
- Won't hurt UX since traffic is low
- Ads will scale with traffic growth
- AdSense account stays "active"

**Option 2: Wait for Traffic**
- Wait until 100+ visitors/day
- Better initial impression
- Can A/B test placements

**My recommendation**: Enable Auto Ads NOW. Set it and forget it.

---

## 🛠️ Implementation Checklist

- [ ] Get AdSense publisher ID
- [ ] Add AdSense script to `app/layout.tsx`
- [ ] Enable Auto Ads in dashboard
- [ ] Test ads appear (use VPN or incognito if needed)
- [ ] Add ads.txt file to public folder
- [ ] Monitor performance in AdSense dashboard
- [ ] Adjust placements based on data (after 1-2 weeks)

---

## 📱 Mobile Optimization

```typescript
// components/MobileAdSense.tsx
"use client"

import { useEffect } from 'react'

export default function MobileAdSense() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    }
  }, [])

  return (
    <div className="ad-container my-4 md:hidden">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot="MOBILE_AD_SLOT"
        data-ad-format="rectangle"
      />
    </div>
  )
}
```

---

## 🎯 Next Steps

1. **Today**: Enable Auto Ads (5 minutes)
2. **This Week**: Add 100 wallpapers
3. **Next Week**: Check AdSense reports
4. **Month 1**: Optimize based on data

---

**Need help implementing?** Just ask me to:
1. Add the AdSense script
2. Create the AdSense component
3. Place ads in optimal positions

