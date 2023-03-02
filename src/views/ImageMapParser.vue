<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="code-input">
          <label>HTML Input</label>
          <textarea rows="5" cols="30" v-model="imageMapInput"></textarea>
        </div>
      </div>
    </div>

    <div>
      <button @click="handleProcess(imageMapInput)">Process</button>
    </div>

    <div class="code-output">
      <a href="#" @click="toggleShowOutput">{{
        showOutput ? "Hide Output" : "Show Output"
      }}</a>

      <div v-if="showOutput" class="row">
        <div class="col-6">
          <div class="output-header">
            <label>Result</label>
            <a href="#" @click="handleCopyOutput('output-data')">Copy</a>
          </div>
          <div class="result" id="output-data">{{ imageMapData }}</div>
        </div>
        <div class="col-6">
          <div class="preview">
            <label>Preview</label>
            <div>
              <img
                :src="imageMap.imageUrl"
                usemap="#image-map"
                alt="image map"
              />
              <map name="image-map">
                <area
                  v-for="(area, index) in imageMap.areas"
                  :key="index"
                  :shape="area.shape"
                  :target="area.target"
                  :alt="area.alt"
                  :title="area.title"
                  :href="area.href"
                  :coords="toCoordsValue(area.shape, area)"
                />
              </map>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <form novalidate>
        <div class="table-responsive">
          <table class="table caption-top">
            <caption>
              List of Area
            </caption>
            <thead class="table-light">
              <tr>
                <td>Package</td>
                <td colspan="2">
                  <input
                    type="text"
                    class="form-control"
                    :disabled="!imageMap.areas.length"
                    @change="handlePackageCodeChange"
                  />
                </td>
              </tr>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Shape</th>
                <th scope="col">Coordinates</th>
                <th scope="col">Title</th>
                <th scope="col">Alt</th>
                <th scope="col">Target</th>
                <th scope="col">Link</th>
                <th scope="col">Package</th>
                <th scope="col">Zone</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(area, index) in imageMap.areas" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ area.shape }}</td>
                <td>
                  {{ toCoordsValue(area.shape, area) }}
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    v-model="area.title"
                  />
                </td>
                <td>
                  <input type="text" class="form-control" v-model="area.alt" />
                </td>
                <td>
                  <select class="form-select" v-model="area.target">
                    <option value=""></option>
                    <option value="_blank">_blank</option>
                    <option value="_self">_self</option>
                    <option value="_parent">_parent</option>
                    <option value="_top">_top</option>
                  </select>
                </td>
                <td>
                  <input type="text" class="form-control" v-model="area.href" />
                </td>
                <td>
                  {{ area.packageCode }}
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    v-model="area.zoneCode"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import jquery from "jquery";
import { copyToClipboard } from "@/utils/common";

export default {
  data() {
    return {
      showOutput: false,
      imageMapInput:
        '<img src="/src/assets/images/851-zone.jpg" usemap="#image-map"><map name="image-map"><area target="" alt="area 1" title="area 1" href="" coords="201,188,298,335" shape="rect"><area target="" alt="area 2" title="area 2" href="" coords="436,183,436,241,474,241,476,252,495,252,495,209" shape="poly"><area target="" alt="area 3" title="area 3" href="" coords="299,496,32" shape="circle"></map>',
      imageMap: {
        imageUrl: "",
        areas: [],
      },
    };
  },
  computed: {
    imageMapData() {
      return JSON.stringify(this.imageMap);
    },
  },
  methods: {
    resetDefaultImageMap() {
      this.imageMap = {
        imageUrl: "",
        areas: [],
      };
    },
    toggleShowOutput() {
      this.showOutput = !this.showOutput;
    },
    toCoordsValue(shape, area) {
      const result = area.coords
        .map((coord) => `${coord.x},${coord.y}`)
        .join(",");

      if (shape === "circle") {
        return result + "," + area.radius;
      }

      return result;
    },
    areaRectangle(elem) {
      const [x, y, cx, cy] = elem.getAttribute("coords").split(",");
      return {
        shape: "rect",
        target: elem.getAttribute("target"),
        alt: elem.getAttribute("alt"),
        title: elem.getAttribute("title"),
        href: elem.getAttribute("href"),
        coords: [
          {
            x,
            y,
          },
          {
            x: cx,
            y: cy,
          },
        ],
        width: cx - x,
        height: cy - y,
      };
    },
    areaPolygon(elem) {
      const coords = elem
        .getAttribute("coords")
        .split(",")
        .reduce((result, coord, index) => {
          if (index % 2 === 0) {
            result.push({
              x: coord,
            });
          } else {
            result[result.length - 1].y = coord;
          }
          return result;
        }, []);
      return {
        shape: "poly",
        target: elem.getAttribute("target"),
        alt: elem.getAttribute("alt"),
        title: elem.getAttribute("title"),
        href: elem.getAttribute("href"),
        coords,
      };
    },
    areaCircle(elem) {
      const [x, y, r] = elem.getAttribute("coords").split(",");
      return {
        shape: "circle",
        target: elem.getAttribute("target"),
        alt: elem.getAttribute("alt"),
        title: elem.getAttribute("title"),
        href: elem.getAttribute("href"),
        coords: [
          {
            x,
            y,
          },
        ],
        radius: r,
      };
    },
    handleProcess(value) {
      let imgEl, mapEl;

      const html = jquery.parseHTML(value);
      for (const el of html) {
        if (el.tagName.toLowerCase() === "img") {
          imgEl = jquery(el);
        } else if (el.tagName.toLowerCase() === "map") {
          mapEl = jquery(el);
        }
      }

      this.resetDefaultImageMap();

      if (imgEl) {
        this.imageMap.imageUrl = imgEl.attr("src");
      }

      if (mapEl && mapEl.children().length > 0) {
        for (const area of mapEl.children()) {
          let areaObj = {};

          if (area.getAttribute("shape") === "rect") {
            areaObj = this.areaRectangle(area);
          } else if (area.getAttribute("shape") === "poly") {
            areaObj = this.areaPolygon(area);
          } else if (area.getAttribute("shape") === "circle") {
            areaObj = this.areaCircle(area);
          }

          this.imageMap.areas.push(areaObj);
        }
      }
    },
    handleCopyOutput(elementId) {
      copyToClipboard(elementId);
      alert("Copied");
    },
    handlePackageCodeChange(e) {
      for (const area of this.imageMap.areas) {
        area.packageCode = e.target.value;
      }
    },
  },
};
</script>

<style scoped>
label {
  font-weight: bold;
}

.code-output {
  margin-top: 10px;
  margin-bottom: 5px;
}

.code-input textarea {
  width: 100%;
  white-space: pre;
}

.code-output textarea {
  width: 100%;
  white-space: pre;
  word-wrap: break-word;
  background-color: #eee;
  opacity: 1;
  cursor: not-allowed;
}

.code-output .result {
  border: 1px solid;
  padding: 2px;
  /* height: 100%; */
}

.output-header {
  display: flex;
  justify-content: space-between;
}
</style>
