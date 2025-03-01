"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function LicensePage() {
  const platformLicenses = [
    {
      name: "Pexels",
      url: "https://www.pexels.com/license/",
      description: "Free to use, no attribution required"
    },
    {
      name: "Pixabay",
      url: "https://pixabay.com/service/license/",
      description: "Free for commercial use, no attribution required"
    },
    {
      name: "Unsplash",
      url: "https://unsplash.com/license",
      description: "Free to use, attribution appreciated"
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            License Information
          </h1>
          <div className="flex justify-center mb-8">
            <Link 
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="license noopener noreferrer"
            >
              <Image
                src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
                alt="Creative Commons License"
                width={88}
                height={31}
                className="dark:brightness-200"
                unoptimized
              />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
        {/* Platform Licenses */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary/5 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Image Sources & Licenses</h2>
          <div className="grid gap-6">
            {platformLicenses.map((platform) => (
              <div key={platform.name} className="p-4 bg-background/50 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold text-lg mb-2">{platform.name}</h3>
                <p className="text-muted-foreground mb-3">{platform.description}</p>
                <Link 
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  View License Terms
                </Link>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary/5 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">License Terms</h2>
          <div className="prose prose-lg dark:prose-invert">
            <p>
              This work is licensed under a{' '}
              <Link 
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="license noopener noreferrer"
                className="text-primary hover:underline"
              >
                Creative Commons Attribution-ShareAlike 4.0 International License
              </Link>.
            </p>
            <p>Under this license, you are free to:</p>
            <ul>
              <li>Share — copy and redistribute the material in any medium or format</li>
              <li>Adapt — remix, transform, and build upon the material for any purpose</li>
            </ul>
            <p>Under the following terms:</p>
            <ul>
              <li>
                <strong>Attribution</strong> — You must give appropriate credit to Wallpaperz 
                and original creators, provide a link to the license, and indicate if changes were made.
              </li>
              <li>
                <strong>ShareAlike</strong> — If you remix, transform, or build upon the material, 
                you must distribute your contributions under the same license as the original.
              </li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary/5 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Image Sources</h2>
          <div className="prose prose-lg dark:prose-invert">
            <p>Our wallpapers are sourced from:</p>
            <ul>
              <li>Pexels (under the Pexels License)</li>
              <li>Pixabay (under the Pixabay License)</li>
              <li>Unsplash (under the Unsplash License)</li>
            </ul>
            <p>
              Individual images may have specific attribution requirements. Please check the 
              download information for each wallpaper for detailed licensing information.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}