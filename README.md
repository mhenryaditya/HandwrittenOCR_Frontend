# HandwrittenOCR Frontend

## ✨ Introduction
This is the frontend application for **HandwrittenOCR**, a web-based Optical Character Recognition system. It allows users to upload handwritten images and receive extracted text in return, including words, full sentences, and alphanumeric strings (e.g., `ADjh90K7`).

Built with [Next.js](https://nextjs.org), this frontend interfaces with a backend API (Laravel or Flask) for processing and OCR prediction.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mhenryaditya/HandwrittenOCR_Frontend.git
cd HandwrittenOCR_Frontend
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Create `.env` file
Create a `.env` file in the root directory with the following content:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
Replace the value with the actual backend API endpoint for HandwrittenOCR Laravel Backend.

### 4. Start development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

---

## 📚 Learn More About Next.js

To learn more about Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) – learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) – an interactive tutorial for learning Next.js step-by-step.

---

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is via [Vercel](https://vercel.com/new). Follow these steps:

1. Push your project to GitHub.
2. Visit [https://vercel.com/new](https://vercel.com/new) and import the repo.
3. Set your environment variable (`NEXT_PUBLIC_API_URL`) in Vercel dashboard.
4. Deploy and enjoy.

For more info, check out the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying).

---

Happy coding! ✍️📸
