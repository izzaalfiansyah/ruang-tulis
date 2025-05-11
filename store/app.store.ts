export const appStore = defineStore("app", {
  state() {
    return {
      title:
        "Ruang Tulis - Setiap huruf menjadi jembatan antara isi hati dan kenyataan",
      description: `Sebuah tempat sunyi di tengah riuhnya dunia. Sebuah taman rahasia tempat
      kata-kata tumbuh bebas. Setiap huruf menjadi jembatan antara isi hati dan
      kenyataan. Engkau bisa menyusun perasaan, membingkai kenangan, atau
      sekadar menyapa diri sendiri.`,
    };
  },
  actions: {
    seoMeta(props?: { title?: string; description?: string }) {
      let title = this.title;

      if (props?.title) {
        title = `${props.title} - Ruang Tulis`;
      }

      useSeoMeta({
        title,
        description: props?.description ?? this.description,
      });
    },
  },
});
