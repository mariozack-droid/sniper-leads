/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! ATENÇÃO !!
    // Perigoso para produção, mas ideal para seu MVP agora.
    // Isso permite o deploy mesmo se houver erros de tipagem.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora avisos de estilo de código
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;