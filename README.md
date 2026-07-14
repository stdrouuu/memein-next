# Memein - Meme Editor built with Next.js w/ Typescript, Shadcn, Tailwind, React Konva, & GSAP

## Deployment  
This project is deployed on **Vercel**, the platform created by the makers of Next.js, for seamless and fast deployment of modern web applications.

## Live: https://memein.vercel.app/
<!-- <img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/4b454178-0a77-48f9-a4f6-d68e9c47d305" /> -->
<!-- <img alt="Image" src="https://github.com/user-attachments/assets/08e73d2e-ccfe-47e7-aa63-fa148314554d" /> -->
<img alt="Image" src="https://github.com/user-attachments/assets/ff390870-8f6c-4e61-9f56-bee9a328d9fc" /> 

For more details about deploying apps to Vercel, check out the official documentation: (https://vercel.com/docs)

## About This Project  
This is a meme maker app called MemeIn that I built using **Next.js - Typescript** with **Shadcn**, **Tailwind CSS**, **GSAP**, and **React Konva**. I used **React Konva** Javascript library to implement the canvas functionality, so users can upload images and edit them directly on the canvas. I also integrated the **Imgflip API** to fetch and display popular meme templates directly inside the editor, with a fallback set of templates for offline/error handling. I also try adding support for light, dark, and system themes so users can switch based on their preference or device settings. 

I'm still learning TypeScript, and this project has been a great way to practice it.

## Tech Stack
*   **Framework & Language**: [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) for a robust, type-safe, and lightning-fast developer experience.
*   **Graphics & Canvas**: [React Konva](https://konvajs.org/docs/react/index.html) + HTML5 Canvas API for real-time local image uploads, interactive text layers, dragging, resizing, and professional exports.
*   **Animations**: [GSAP](https://gsap.com/) powering high-fidelity animations, a custom interactive loading skeleton, responsive entrance micro-interactions, and premium UI morphing transitions.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) utilizing native CSS variables, modular layout design, custom background noise textures, and sleek dark/light mode configurations.
*   **Components**: [Shadcn UI](https://ui.shadcn.com/) (which leverages [Radix UI Primitives](https://www.radix-ui.com/)) for accessible dropdowns, labels, and form components.
*   **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes) (Shadcn's default theme provider) for adaptive dark, light, and system color mode matching.
*   **Toast Notifications**: [Gooey Toast (goey-toast)](https://github.com/aidenybai/goey-toast) for fluid, gooey physics-based toast notifications.
*   **Icons**: [reicon-react](https://github.com/reicon-react) for high-end custom designed vector icons.

## Getting Started
This is a [Next.js](https://nextjs.org) project. First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
