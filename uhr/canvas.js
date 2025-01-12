// Werte aus den URL-Parameter lesen
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var start = urlParams.get('start');
var phasenzeiten = urlParams.get('phasenzeiten');
var jetzt = new Date();
var jetztArray = [jetzt.getHours(), jetzt.getMinutes(), jetzt.getSeconds()];
var phasenzeitenSum = [];
var sum = 0;
var vergangeneSekunden = 0;
var remainingTime = 0;
var currentSlot = 0;

$.getJSON('./../config.json', function(config) {
  // Wenn kein Startwert angegeben wurde, wird der aktuelle Zeitpunkt angenommen
  if (start !== null) {
    start = start.split("-").map(Number);
    vergangeneSekunden = (jetztArray[0] - start[0]) * 3600 + (jetztArray[1] - start[1]) * 60 + (jetztArray[2] - start[2]);
  } else {
    urlParams.set('start', jetztArray.join('-'));
    window.history.replaceState({}, '', '?' + urlParams.toString());
    start = jetztArray;
  }

  // Wenn kein Modell angegeben wurde (weil man direkt auf die /uhr.html-Seite gegangen ist) wird das Standardmodell angenommen
  if (phasenzeiten !== null) {
    phasenzeiten = phasenzeiten.split("-").map(Number);
  } else {
    urlParams.set('phasenzeiten', config.defaultModel.join('-'));
    window.history.replaceState({}, '', '?' + urlParams.toString());
    phasenzeiten = config.defaultModel;
  }

  // Pasenzeiten in Sekunden umrechnen
  phasenzeiten = phasenzeiten.map(dur => dur * 60);

  // anlegen einer Liste mit aufsummierten Zeiten
  phasenzeiten.forEach(dur => {
    sum += dur;
    phasenzeitenSum.push(sum);
  });

  // Berechnung des Start-Slot
  for (var i = 0; i < phasenzeiten.length; i++) {
    if (vergangeneSekunden < phasenzeitenSum[i]) {
      remainingTime = phasenzeitenSum[i] - vergangeneSekunden;
      break;
    }
    currentSlot ++;
  }

  // Offset für die Doughnut-Chart
  if (config.anzPhasen == 5) {
    var offset = [0, 0, 0, 0, 0, 0];
  } else if (config.anzPhasen == 4) {
    var offset = [0, 0, 0, 0, 0];
  }
  
  // Chart
  const ctx = $('#myDoughnutChart')[0].getContext('2d');
  const myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: config.phasen,
      datasets: [{
        data: phasenzeiten,
        backgroundColor: config.chartColors,
        offset: offset,
        borderColor: config.chartBorderColor
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false // keine Legenden
        },
        tooltip: {
          enabled: false // kein Feld mit Werten, wenn man über die Flächen hovert
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // aktualisiere die Seite jede Sekunde
  $(document).ready(function() {
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  });

  // Plus-1min-Button
  $('#addMinute').click(function() {
    phasenzeiten[1] += 60;
    phasenzeiten[3] -= 60;
    remainingTime += 60;

    // wenn es keine Partnerarbeitsphase mehr gibt, rechne auch die Organisationsphase zwischen den beiden Arbeitsphasen zur Einzelarbeitsphase
    if (phasenzeiten[3] == 0) {
      phasenzeiten[1] += phasenzeiten[2];
      remainingTime += phasenzeiten[2];
      phasenzeiten[2] = 0;

    }

    urlParams.set('phasenzeiten', phasenzeiten.map(dur => dur / 60).join('-'));
    window.history.replaceState({}, '', '?' + urlParams.toString());
  });

  // Home-Button
  $('#home').click(function() {
    window.location.href = './..';
  });

  // get Offset
  function getOffset(currentSlot) {
    var offset0 = [];
    if (config.anzPhasen == 5) {
      offset0 = [0, 0, 0, 0, 0, 0];
    } else if (config.anzPhasen == 4) {
      offset0 = [0, 0, 0, 0, 0];
    }

    offset0[currentSlot] = 120;

    return offset0;
  }

  // Updatefunktion
  function updateCountdown() {
    if (remainingTime <= 0) {
      currentSlot++;
      remainingTime = phasenzeiten[currentSlot];
    }

    // Aussehen der Uhr anpassen
    myDoughnutChart.data.datasets[0].offset = getOffset(currentSlot);
    $(document.body).css('background-color', config.documentBackgroundColor[currentSlot]);
    $('#description').text(config.phasen[currentSlot]);
    
    // Chart updaten
    myDoughnutChart.update();

    // Während Slot 1 wird der plus1-Button angezeigt
    if (currentSlot == 1 && phasenzeiten[3] > 0) {
      $('#addMinute').css('display', 'block');
      $('#addMinute').css('background-color', config.chartColors[1]);
    } else {
      $('#addMinute').css('display', 'none');
    }

    // Wenn letzter Slot erreicht, wird der Countdown ausgeblendet
    if (currentSlot < 5) {	
      var minutes = Math.floor(remainingTime / 60);
      var seconds = remainingTime % 60;
      $('#countdown').text(minutes + ':' + seconds.toString().padStart(2, '0'));
      
      remainingTime--;
    } else {
      $('#countdown').css('display', 'none');

      $('#home').css('display', 'block');
    }
  }
}).fail(function(jqxhr, textStatus, error) {
  console.error('Error loading config:', textStatus, error);
});