

<div align="center">
  <span style="font-size:3rem;">🍽️</span>
  <h1 style="font-size:1.5rem;font-weight:bold;color:#fff;">Hela Bojun Hala</h1>
  <p style="font-size:0.9rem;color:#888;">Food Delivery</p>
</div>

## Setup Instructions

### Local Development

1. Install dependencies:
   ```sh
   cd frontend
   pnpm install
   ```
2. Start the development server:
   ```sh
   pnpm dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

1. Build the Docker image:
   ```sh
   cd frontend
   docker build -t helabojun-frontend .
   ```
2. Run the Docker container:
   ```sh
   docker run -d -p 3000:3000 --name helabojun-frontend-container helabojun-frontend
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

