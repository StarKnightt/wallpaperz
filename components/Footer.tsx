export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Wallpaperz</h3>
            <p className="text-sm text-muted-foreground">Your source for amazing wallpapers</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Wallpaperz. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
