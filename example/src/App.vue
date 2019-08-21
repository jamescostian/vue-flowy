<template>
  <div id="app">
    <h2>Without direction</h2>
    <vue-flowy :chart="chart"></vue-flowy>
  </div>
</template>

<script>
import {VueFlowy, FlowChart} from '../../dist/VueFlowy.umd.js'

export default {
  name: "App",
  components: {
    VueFlowy
  },
  data: function() {
    return {
      chart: new FlowChart({
        direction: "TB",
        wordWrap: {
          trim: true,
          cut: true,
          indent: '',
          width: 30
        }
      })
    };
  },
  mounted() {
    // first flowChart
    const idea = this.chart.addElement("idea");
    const A = this.chart.addElement("A", { label: "vscode alsdkfj aslkdfj laksdj flkasdjf lkasdj flkasdjlf kjsdlk jflskadj f", style: { fill: "#ccc" } });
    const B = this.chart.addElement("B", { label: "asdlfiasjdlfkajdsfl;iajdf;lawekjfal;efjas;ldfjasdl;fkjasdl;kfjas d;lkjfas;l dkjfas ;ldkjf ;lasdkjf ;laskdj f;laksdjf l;kasdjf ;lksadjf asdkljf asd" });
    const C = this.chart.addElement("C", { label: "npm" });
    const D = this.chart.addElement("D", {
      label: "not sure what else",
      rectStyle: { fill: "#444" },
      textStyle: { fill: "white" }
    });
    idea.leadsTo(A).leadsTo(B);
    A.leadsTo(C);
    A.leadsTo(D);

    A.on("click", function() {
      console.log("click!");
    });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.flow-chart > svg {
  margin: 0 auto;
}
</style>
