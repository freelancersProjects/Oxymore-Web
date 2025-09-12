// vite.config.ts
import { defineConfig } from "file:///G:/projet/WebDigit/Sites/Oxymore/Oxymore-WebDigit/apps/oxymore-admin/node_modules/vite/dist/node/index.js";
import react from "file:///G:/projet/WebDigit/Sites/Oxymore/Oxymore-WebDigit/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "G:\\projet\\WebDigit\\Sites\\Oxymore\\Oxymore-WebDigit\\apps\\oxymore-admin";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    allowedHosts: [
      "localhost",
      "6fd69811d15f.ngrok-free.app"
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@pages": path.resolve(__vite_injected_original_dirname, "./src/pages"),
      "@hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils"),
      "@types": path.resolve(__vite_injected_original_dirname, "./src/types"),
      "@api": path.resolve(__vite_injected_original_dirname, "./src/api"),
      "@assets": path.resolve(__vite_injected_original_dirname, "./src/assets"),
      "@oxm-ui": path.resolve(__vite_injected_original_dirname, "../../packages/oxm-ui/src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxwcm9qZXRcXFxcV2ViRGlnaXRcXFxcU2l0ZXNcXFxcT3h5bW9yZVxcXFxPeHltb3JlLVdlYkRpZ2l0XFxcXGFwcHNcXFxcb3h5bW9yZS1hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRzpcXFxccHJvamV0XFxcXFdlYkRpZ2l0XFxcXFNpdGVzXFxcXE94eW1vcmVcXFxcT3h5bW9yZS1XZWJEaWdpdFxcXFxhcHBzXFxcXG94eW1vcmUtYWRtaW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0c6L3Byb2pldC9XZWJEaWdpdC9TaXRlcy9PeHltb3JlL094eW1vcmUtV2ViRGlnaXQvYXBwcy9veHltb3JlLWFkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA1MTc1LFxyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIGFsbG93ZWRIb3N0czogW1xyXG4gICAgICBcImxvY2FsaG9zdFwiLFxyXG4gICAgICBcIjZmZDY5ODExZDE1Zi5uZ3Jvay1mcmVlLmFwcFwiXHJcbiAgICBdXHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG4gICAgICAnQGNvbXBvbmVudHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cycpLFxyXG4gICAgICAnQHBhZ2VzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BhZ2VzJyksXHJcbiAgICAgICdAaG9va3MnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvaG9va3MnKSxcclxuICAgICAgJ0B1dGlscyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscycpLFxyXG4gICAgICAnQHR5cGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3R5cGVzJyksXHJcbiAgICAgICdAYXBpJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2FwaScpLFxyXG4gICAgICAnQGFzc2V0cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9hc3NldHMnKSxcclxuICAgICAgJ0BveG0tdWknOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vcGFja2FnZXMvb3htLXVpL3NyYycpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4WSxTQUFTLG9CQUFvQjtBQUMzYSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsTUFDWjtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3BDLGVBQWUsS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQ3pELFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMvQyxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDL0MsVUFBVSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQy9DLFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMvQyxRQUFRLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsTUFDM0MsV0FBVyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ2pELFdBQVcsS0FBSyxRQUFRLGtDQUFXLDJCQUEyQjtBQUFBLElBQ2hFO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
