export const siteConfig = {
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://scrape-bot-eight.vercel.app",
  name: "ScrapeBot",
  description:
    "A platform to visually create and manage web scrapers without writing code. Simplifying data extraction with an intuitive drag-and-drop interface and a scheduling system for automating data collection. Additionally, it includes the option to integrate AI into the web scraping process if desired.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
