# 🎨 Exhibition Curation Platform

An intuitive platform for curating, managing, and exploring exhibitions using data from The Met and Rijksmuseum APIs.

## 🚀 Features

- **User Authentication:** Secure login and authentication via Supabase.
- **Curate Collections:** Create, manage, and delete exhibitions with selected artworks.
- **Multi-Source Artwork Search:** Search artworks from The Met and Rijksmuseum APIs.
- **Custom Date Filters:** Use a dual-range slider to filter artworks by time periods.
- **Favorites & Collections:** Add artworks to your personal curated exhibitions.
- **Mobile Responsive UI:** Sleek and modern design optimized for different screen sizes.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **State Management:** React Context, React Query
- **Backend & Database:** Supabase(postgreSQL)
- **UI Components:** Material UI

## Hosted Version

https://exhibition-platform-ten.vercel.app/

you can access a test account by logging in with :

email: test123@test.email
passord: 123456

## 📦 Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/exhibition-curation-platform.git
   cd exhibition-curation-platform
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file and add:

   ```sh
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_RIJKS_API_KEY =your_rijks_museum_api_key
   ```

   ps: you will have to set up your supabase db tables and policies to correctly work

4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🖼️ Usage

- **Search Artworks:** Use the search page to browse artworks from The Met or Rijksmuseum.
- **Filter by Date & Department:** Adjust filters for refined search results.
- **Save to Collections:** Add artworks to your curated exhibitions.
- **Manage Exhibitions:** View, update, and delete your curated exhibitions.

## 🔒 Authentication & Security

- Supabase handles authentication and user-specific exhibition storage.
- Role-based access control (RLS policies) ensures secure data management.

## 🎯 Roadmap

- ✅ Basic authentication & collection management
- ✅ Improved UI & search functionality

## 🌟 Acknowledgments

- [The Met API](https://metmuseum.github.io/)
- [Rijksmuseum API](https://data.rijksmuseum.nl/)
- [Supabase](https://supabase.com/)
