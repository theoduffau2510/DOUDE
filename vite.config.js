import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: '/',
    
    // Configuration du serveur de développement
    server: {
      port: 5173,
      open: true, // Ouvre automatiquement le navigateur
      cors: true,
    },
    
    // Configuration du build de production
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development', // Sourcemaps uniquement en dev
      
      // Optimisations
      minify: 'esbuild',
      target: 'esnext',
      
      // Chunking strategy pour une meilleure performance
      rollupOptions: {
        output: {
          manualChunks: {
            // Séparer les vendors des gros packages
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'supabase': ['@supabase/supabase-js'],
            'ui': ['lucide-react', 'framer-motion'],
          }
        }
      },
      
      // Augmenter la limite de warning pour les gros chunks (si nécessaire)
      chunkSizeWarningLimit: 1000,
    },
    
    // Résolution des alias (optionnel mais pratique)
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@lib': '/src/lib',
        '@hooks': '/src/hooks',
        '@contexts': '/src/contexts',
      }
    },
    
    // Variables d'environnement
    // Vite expose automatiquement les variables commençant par VITE_
    define: {
      // Ajouter des variables supplémentaires si nécessaire
      // 'import.meta.env.MODE': JSON.stringify(mode),
    }
  }
})