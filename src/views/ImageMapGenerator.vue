<template>
  <div class="image-map-generator">
    <div class="tools">
      <div
        :class="{ active: shapeMode === 'rect' }"
        @click="handleShapeModeClick('rect')"
      >
        Rectangle
      </div>
      <div
        :class="{ active: shapeMode === 'poly' }"
        @click="handleShapeModeClick('poly')"
      >
        Polygon
      </div>
      <div
        :class="{ active: shapeMode === 'circle' }"
        @click="handleShapeModeClick('circle')"
      >
        Circle
      </div>
    </div>
    <div class="image-map-container">
      <div class="image-mapper">
        <img id="mapImg" src="@/assets/images/851-zone.jpg" />
        <svg
          id="svgDrawer"
          @mousedown="handleSvgMouseDown"
          @mousemove="handleSvgMove"
          @mouseup="handleSvgEndMove"
          @mouseout="handleSvgEndMove"
        ></svg>
      </div>
    </div>
  </div>
</template>

<script>
import { SVG } from "@svgdotjs/svg.js";
/*
  doc: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area
  Rectangle Area:
  {
    shape: 'rect',
    coords: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 253,
        y: 27,
      }
    ],
    title: 'The Rectangle',
    href: 'https://google.co.th',
    target: '_blank',
  }

  Polygon Area:
  {
    shape: 'poly',
    coords: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 253,
        y: 27,
      },
      ...
    ],
    title: '',
    href: '',
    target: '',
  }

  Circle Area:
  {
    shape: 'circle',
    coords: [
      {
        x: 0,
        y: 0,
      }
    ],
    radius: 50
  }
*/
export default {
  data() {
    return {
      svgDrawer: null,
      areas: [
        {
          shape: "rect",
          coords: [],
          title: "",
          href: "",
          target: "",
        },
      ],
      areaIndex: 0,
      targetElement: null,
      shapeMode: "rect",
      shapeDrawn: false,
    };
  },
  mounted() {
    this.svgDrawer = SVG("#svgDrawer");
  },
  methods: {
    getCoordinate(el, evt) {
      const rect = el.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    },
    handleShapeModeClick(value) {
      this.shapeMode = value;
    },
    handleShapeMouseDown(evt) {
      evt.preventDefault();
      this.targetElement = evt.target;
      // console.log("attr data-shape ->", evt.target.getAttribute("data-shape"));
      // console.log("point down -> x:", evt.offsetX, ", y:", evt.offsetY);
    },
    checkAllowToAddPoint() {
      // polygon or empty areas
      if (this.shapeMode === "poly") {
        return true;
      }
      // rect: x1,y1,x2,y2
      // circle: x,y,radius
      const area = this.areas[this.areaIndex];
      if (area.coords.length >= 2) {
        return false;
      }
      return true;
    },
    updateSize(shape, deltaWidth, deltaHeight) {
      // const shape = SVG(shapeElement);
      // Calculate the new size.
      const elemWidth = shape.width();
      const elemHeight = shape.height();
      let newWidth = elemWidth + deltaWidth;
      let newHeight = elemHeight + deltaHeight;

      // Don't allow a too small size.
      if (newWidth < 0) {
        newWidth = 0;
      }
      if (newHeight < 0) {
        newHeight = 0;
      }

      // Set the new size.
      shape.width(newWidth).height(newHeight);
    },
    drawPoint(index, evt) {
      const x = evt.offsetX;
      const y = evt.offsetY;

      const coordIndex = this.areas[index].coords.length;

      this.svgDrawer
        .circle(10)
        .attr({
          cx: x,
          cy: y,
          fill: "rgb(255, 255, 255)",
          stroke: "rgb(51, 51, 51)",
          "stroke-width": 1,
          opacity: 0.6,
          cursor: "pointer",
        })
        .data({
          shape: "point",
          "area-index": index,
          "coord-index": coordIndex,
        })
        .on("mousedown", this.handleShapeMouseDown);

      this.areas[index].coords.push({
        x,
        y,
      });
    },
    drawRectangle(index) {
      const p1 = this.areas[index].coords[0];
      const p2 = this.areas[index].coords[1];

      const width = Math.abs(p2.x - p1.x);
      const height = Math.abs(p2.y - p1.y);

      const x = p2.x > p1.x ? p1.x : p2.x;
      const y = p2.y > p1.y ? p1.y : p2.y;

      this.svgDrawer
        .rect(width, height)
        .attr({
          x: x,
          y: y,
          fill: "rgb(102, 102, 102)",
          stroke: "rgb(51, 51, 51)",
          "stroke-width": 1,
          opacity: 0.6,
          cursor: "pointer",
        })
        .data({
          shape: "rectangle",
          "area-index": index,
        })
        .on("mousedown", this.handleShapeMouseDown);

      this.shapeDrawn = true;
    },
    drawCircle(index) {
      const p1 = this.areas[index].coords[0];
      const p2 = this.areas[index].coords[1];
      // d = √((x1 - x2)pow2+(y1 - y2)pow2)
      const diameter =
        Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) * 2;

      this.svgDrawer
        .circle(diameter)
        .attr({
          cx: p1.x,
          cy: p1.y,
          fill: "rgb(102, 102, 102)",
          stroke: "rgb(51, 51, 51)",
          "stroke-width": 1,
          opacity: 0.6,
          cursor: "pointer",
        })
        .data({
          shape: "circle",
          "area-index": index,
        })
        .on("mousedown", this.handleShapeMouseDown);

      this.shapeDrawn = true;
    },
    // click for marking a point on the image map
    handleSvgMouseDown(evt) {
      if (this.targetElement) {
        return;
      }

      if (!this.checkAllowToAddPoint()) {
        return;
      }

      this.drawPoint(this.areaIndex, evt);

      if (
        this.shapeMode === "rect" &&
        this.areas[this.areaIndex].coords.length === 2
      ) {
        this.drawRectangle(this.areaIndex);
      } else if (
        this.shapeMode === "circle" &&
        this.areas[this.areaIndex].coords.length === 2
      ) {
        this.drawCircle(this.areaIndex);
      }
    },
    movePoint(el, x, y) {
      // move shape
      SVG(el).cx(x).cy(y);
      // update coordinate of area
      const areaIndex = this.targetElement.getAttribute("data-area-index");
      const coordIndex = this.targetElement.getAttribute("data-coord-index");
      this.areas[areaIndex].coords[coordIndex].x = x;
      this.areas[areaIndex].coords[coordIndex].y = y;
    },
    findAllElementsOfArea(areaIndex) {
      return this.svgDrawer
        .children()
        .filter(
          (child) => child.node.getAttribute("data-area-index") === areaIndex
        );
    },
    findOneCoordElement(areaIndex, coordIndex) {
      const elements = this.svgDrawer
        .children()
        .filter(
          (child) =>
            child.node.getAttribute("data-area-index") === areaIndex &&
            child.node.getAttribute("data-coord-index") === coordIndex
        );
      return elements.length ? elements[0] : null;
    },
    findAllCoordElements(areaIndex) {
      return this.svgDrawer
        .children()
        .filter(
          (child) =>
            child.node.getAttribute("data-area-index") === areaIndex &&
            child.node.hasAttribute("data-coord-index")
        );
    },
    findShapeElement(areaIndex) {
      const elements = this.svgDrawer.children().filter((child) => {
        return (
          child.node.getAttribute("data-area-index") === areaIndex &&
          !child.node.hasAttribute("data-coord-index")
        );
      });
      return elements.length ? elements[0] : null;
    },
    handleSvgMove(evt) {
      evt.preventDefault();
      if (
        this.targetElement &&
        this.targetElement.getAttribute("data-shape") === "point"
      ) {
        if (this.shapeDrawn) {
          // move group of shape
          const areaIndex = this.targetElement.getAttribute("data-area-index");
          const shapeElement = this.findShapeElement(areaIndex);
          const coordElements = this.findAllCoordElements(areaIndex);
          console.log("shape ->", shapeElement.node);
          console.log("coords ->", coordElements);
        } else {
          this.movePoint(this.targetElement, evt.offsetX, evt.offsetY);
        }
      }
    },
    handleSvgEndMove(evt) {
      if (evt.type == "mouseout" && this.targetElement) {
        return;
      }
      this.targetElement = null;
    },
  },
};
</script>

<style scoped>
.tools {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
}

.tools div {
  margin-left: 4px;
  margin-right: 4px;
  cursor: pointer;
}

.tools div.active {
  color: cornflowerblue;
  text-decoration: underline;
}

.tools div:hover {
  color: darkgray;
}

.image-map-generator {
  text-align: center;
}

.image-map-container {
  display: inline-block;
  border: 2px solid #ddd;
  padding: 2px;
  border-radius: 3px;
  max-width: 100%;
}

.image-mapper {
  max-width: 100%;
  display: inline-block;
  position: relative;
}

.image-mapper img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}

.image-mapper svg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
