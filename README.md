# Hostmachine Frontend

A secure, high-performance interface for the Hostmachine automated provisioning platform.

## Features

- **Industrial UI:** Clean, high-contrast, terminal-inspired design.
- **Supabase Auth:** Secure authentication via Magic Links.
- **Next.js 16:** Built on the latest React framework for performance.
- **Real-time Control:** Manage game servers, nodes, and billing.

## Getting Started

1.  **Environment Setup:**
    Rename `.env.local` or update it with your real Supabase credentials:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Architecture

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Auth:** Supabase Auth Helpers
- **Icons:** Lucide React

## License

Proprietary - Hostmachine
