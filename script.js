
$(document).ready(function() {
  $.getJSON('config.json', function(config) {
    // Berechnung der Restzeit und Anzeige
    function restzeit(endTimes) {
      const currentTime = new Date();
      let minTime = null;

      $.each(endTimes, function(value) {
        const [hours, minutes] = value.split(':').map(Number);
        const endTime = new Date();
        endTime.setHours(hours, minutes, 0, 0);

        if (endTime > currentTime && (minTime === null || endTime < minTime)) {
          minTime = endTime;
        }
      });

      if (minTime !== null) {
        const remainingMinutes = Math.floor((minTime - currentTime) / 6000 / 10);
        $('#restzeit').text(remainingMinutes);
      } else {
        $('#restzeit').text(0);
      }
    }
    
    function summeManuell() {
      // Berechnung der Summe der manuellen Eingaben
      let restzeit = $('#restzeit').text();
      let total = 0;
    
      $('#model3 input[type="number"]').each(function() {
        total += Number($(this).val());
      });
    
      $('#summeManuell').text(restzeit - total);
    }
    
    // Funktion zum Abrufen des ausgewählten Modells und Weiterleiten zur entsprechenden URL
    function getModelAndRedirect() {
      var selectedModel = $('input[name="model"]:checked').val();
      var selectedLila = $('input[name="lila"]:checked').val();
      var jetzt = new Date();
      var startzeit = [jetzt.getHours(), jetzt.getMinutes(), jetzt.getSeconds()];
    
      var phasenzeiten;
      if (selectedModel == 1) {
        const modelMap = {
          "normal": config.defaultModel,
          "kurz": config.shortPurpleModel,
          "ohne": config.noPurpleModel
        };
    
        const selectedModelArray = modelMap[selectedLila];
        if (selectedModelArray) {
          phasenzeiten = selectedModelArray;
        } else {
          console.error('Error: No lila-mode selected');
        }
      } else if (selectedModel == 2) {
          // Rufe die ausgewählte Stunde ab
          var selectedSchulstunde = $('input[name="endTime"]:checked').val();

          // Entnimm aus der Konfigurationsdatei die Endzeiten der ausgewählten Stunde
          if (selectedSchulstunde != 99) {
            var [endTimeStunde, endTimeMinute] = config.endTimes[selectedSchulstunde].split(':').map(Number);
          } else {
            var [endTimeStunde, endTimeMinute] = $('#endeManuell').val().split(':').map(Number);
          }

          // Berechne die verbleibende Zeit
          var verbleibend = (endTimeStunde - jetzt.getHours()) * 60 + (endTimeMinute - jetzt.getMinutes());
          
          if (verbleibend < 0) {
            verbleibend += 60*24
            return;
          }
          
          var lilaModes = {};
          if (config.anzPhasen == 5) {
            lilaModes = {
              "normal": [config.defaultModel[0], config.defaultModel[2], config.defaultModel[4]],
              "kurz": [config.shortPurpleModel[0], config.shortPurpleModel[2], config.shortPurpleModel[4]],
              "ohne": [config.noPurpleModel[0], config.noPurpleModel[2], config.noPurpleModel[4]]
            };
          } else if (config.anzPhasen == 4) {
            lilaModes = {
              "normal": [config.defaultModel[0], config.defaultModel[2]],
              "kurz": [config.shortPurpleModel[0], config.shortPurpleModel[2]],
              "ohne": [config.noPurpleModel[0], config.noPurpleModel[2]]
            };
          }
          
          var offset = lilaModes[selectedLila].reduce((acc, cur) => acc + cur, 0);
          var epa = Math.floor((verbleibend - offset) / 2);
          var auffuellung = 60 - offset - 2 * epa;
          if (config.anzPhasen == 5) {
            if (verbleibend <= 60) {
              phasenzeiten = [lilaModes[selectedLila][0], epa, lilaModes[selectedLila][1], epa, lilaModes[selectedLila][2], auffuellung];
            } else {
              phasenzeiten = [lilaModes[selectedLila][0], epa, lilaModes[selectedLila][1], epa, lilaModes[selectedLila][2], 0];
            } 
          } else if (config.anzPhasen == 4) {
            if (verbleibend <= 60) {
              phasenzeiten = [lilaModes[selectedLila][0], epa, lilaModes[selectedLila][1], epa, auffuellung];
            } else {
              phasenzeiten = [lilaModes[selectedLila][0], epa, lilaModes[selectedLila][1], epa, 0];
            }
          }

          console.log(phasenzeiten);
      } else if (selectedModel == 3) {
        
        phasenzeiten = [$('#phase1').val(), $('#phase2').val(), $('#phase3').val(), $('#phase4').val(), $('#phase5').val()];
      }
      //console.log('./uhr?start=' + startzeit.join("-") + '&phasenzeiten=' + phasenzeiten.join("-"));
      window.location.href = './uhr?start=' + startzeit.join("-") + '&phasenzeiten=' + phasenzeiten.join("-");
    }

    // Laden der Endzeiten aus der Konfigurationsdatei 
    const endTimeContainer = $('#endTimeContainer');
    const endTimes = config.endTimes;
      
    $.each(endTimes, function(key, value) {
      const div1 = $('<div>');
      const div2 = $('<div>');
      
      div1.html(`
        <input type="radio" name="endTime" value="${key}" id="endTime${key}">
        <label for="endTime${key}">${value}</label>
      `);

      div2.html(`(Ende der ${key}. Stunde)`);

      endTimeContainer.append(div1);
      endTimeContainer.append(div2);
    });

    const div1 = $('<div>');
    const div2 = $('<div>');
    
    div1.html(`
      <input type="radio" name="endTime" value="99" id="endTime99">
      <label for="endTime99"><input type="time" id="endeManuell" autocomplete="off"></label>
    `);

    div2.html('(manuelle Eingabe der Endzeit)');

    endTimeContainer.append(div1);
    endTimeContainer.append(div2);

    // Laden der Phasennamen aus der Konfigurationsdatei
    $('#p1').text(config.phasen[0]);
    $('#p2').text(config.phasen[1]);
    $('#p3').text(config.phasen[2]);
    $('#p4').text(config.phasen[3]);

    if (config.anzPhasen == 5) {
      $('#p5').text(config.phasen[4]);
    } else if (config.anzPhasen == 4) {
      $('.p5').css('display', 'none');
    }

    // Berechnung der Restzeit und Anzeige
    restzeit(endTimes);
    summeManuell();

    // Handhabung der Radio-Button-Änderungen und Kollaps-Animationen
    const radioButtons = $('.radioModel');
    const collapsibles = $('.model2Collapsible, .model3Collapsible');

    radioButtons.on('change', function() {
        collapsibles.each(function() {
            $(this).css('maxHeight', '0');
            $(this).removeClass('expand');
        });

        const targetCollapsible = $(this).next('.radioModelLabel').next('.model2Collapsible, .model3Collapsible');
        if (targetCollapsible.length) {
            targetCollapsible.css('maxHeight', targetCollapsible[0].scrollHeight + 'px');
            targetCollapsible.addClass('expand');
        }
    });

    // regelmäßige Aktualisierung der Restzeit
    setInterval(restzeit, 10000);

    // Manuelle Enduhrzeit auswählen, wenn Zeit in Model 2 gesetzt wurde
    $('#endeManuell').on('change', function() {
      $('#endTime99').prop('checked', true);
    });

    // Bei änderung der manuellen Endzeit wird die Restzeit neu berechnet
    $('input[type="number"]').on('change', function() {
      restzeit(endTimes);
      summeManuell();
    });

    // Weiterleitung auf SegeL-Uhr bei Klick auf Button
    $('#start').on('click', function() {
      getModelAndRedirect();
    });
    
  }).fail(function(jqxhr, textStatus, error) {
    console.error('Error loading config:', textStatus, error);
  });
});