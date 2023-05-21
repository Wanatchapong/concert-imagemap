<template>
  <h3>Download Image from URL</h3>
  <div>
    <label for="">Enter Image URL:</label>
    <input type="text" class="input-img" v-model="imgUrl" />
  </div>
  <div>
    <img
      id="download-img"
      alt=""
      :src="imgUrl + '?v=' + new Date().getTime()"
      crossorigin="anonymous"
    />
  </div>
  <div>
    <button type="button" @click="handleDownload()">Download</button>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      imgUrl:
        "https://pgw-static-sandbox.s3.amazonaws.com/images/qr/6543259.png",
    };
  },
  methods: {
    handleDownload() {
      const imgElem = document.getElementById("download-img");
      const url = imgElem.src || "";

      html2canvas(imgElem, {
        allowTaint: false,
        useCORS: true,
      }).then((canvas) => {
        const a = document.createElement("a");

        a.href = canvas
          .toDataURL("image/jpeg")
          .replace("image/jpeg", "image/octet-stream");

        a.download = url
          .substring(0, url.lastIndexOf("?"))
          .replace(/^.*[\\/]/, "");

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    },
  },
};
</script>

<style scoped>
.input-img {
  width: 100%;
}
</style>