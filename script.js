// Charger la bibliothèque Plotly depuis un CDN
const loadPlotly = () => {
    if (!window.Plotly) {
      const script = document.createElement("script");
      script.src = "https://cdn.plot.ly/plotly-2.20.0.min.js"; // Version récente de Plotly
      script.onload = () => console.log("Plotly loaded");
      document.head.appendChild(script);
    }
  };
  
  loadPlotly();
  
  // Fonction pour dessiner le graphique radar
  const drawRadarChart = (data, element) => {
    const angles = [];
    const traces = [];
  
    // Regrouper les données par TWS (vent)
    const groupedData = data.reduce((acc, row) => {
      if (!acc[row.TWS_rounded]) acc[row.TWS_rounded] = [];
      acc[row.TWS_rounded].push(row);
      return acc;
    }, {});
  
    // Préparer les données pour chaque TWS
    Object.keys(groupedData).forEach((tws) => {
      const group = groupedData[tws];
      const r = group.map((row) => row.lognum);
      const theta = group.map((row) => row.TWA_multiple5);
      angles.push(...theta);
  
      traces.push({
        type: "scatterpolar",
        r: r,
        theta: theta,
        mode: "lines+markers",
        name: `TWS = ${tws} kn`
      });
    });
  
    // Configuration du graphique
    const layout = {
      title: "Polaire nautique",
      polar: {
        radialaxis: {
          visible: true,
          range: [0, Math.max(...data.map((row) => row.lognum))],
          tickfont: { size: 8 }
        },
        angularaxis: {
          visible: true,
          direction: "clockwise",
          rotation: 90,
          tickfont: { size: 8 }
        }
      },
      width: 800,
      height: 600,
      showlegend: true,
      legend: {
        x: 0.1,
        y: -0.05,
        orientation: "v",
        traceorder: "normal"
      }
    };
  
    // Rendre le graphique dans l'élément
    Plotly.newPlot(element, traces, layout);
  };
  
  // Fonction principale appelée par Looker Studio
  dscc.subscribeToData((data) => {
    const element = document.getElementById("container");
    const rows = data.tables.DEFAULT.map((row) => ({
      TWA_multiple5: row.dimensions[0],
      TWS_rounded: row.dimensions[1],
      lognum: row.metrics[0]
    }));
    drawRadarChart(rows, element);
  });
  
