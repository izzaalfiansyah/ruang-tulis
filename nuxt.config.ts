// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  ssr: false,
  app: {
    head: {
      title:
        "Ruang Tulis - Setiap huruf menjadi jembatan antara isi hati dan kenyataan",
      meta: [
        {
          name: "description",
          content: `Sebuah tempat sunyi di tengah riuhnya dunia. Sebuah taman rahasia tempat
      kata-kata tumbuh bebas. Setiap huruf menjadi jembatan antara isi hati dan
      kenyataan. Engkau bisa menyusun perasaan, membingkai kenangan, atau
      sekadar menyapa diri sendiri.`,
        },
      ],
    },
  },
});
