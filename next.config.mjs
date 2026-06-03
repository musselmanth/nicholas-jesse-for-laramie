/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tells Next.js to build a static HTML export in an "out" folder
  output: 'export',
  //basePath: '/nicholas-jesse-for-laramie', // Change this to your GitHub repo name if it's not the root of your user/organization page
  
  // Required if you plan to use the <Image /> component, as GitHub Pages 
  // doesn't have an image optimization server.
  images: {
    unoptimized: true,
  },

  // NOTE: If your GitHub repo is named something like "username.github.io/my-project",
  // you must uncomment the line below and change it to your repo name so CSS/JS assets load correctly.
  // basePath: '/my-project',
};

export default nextConfig;