# segeL-Uhr
## Beschreibung

Die segeL-Uhr hat nichts mit dem Wassersport zu tun. "segeL" steht für "selbstgesteuertes Lernen" und ist ein weit verbreitetes Konzept des eigenständigen Lernens und Arbeitens an Gesamtschulen. Das Konzept des segeLns sieht vor, dass die Schüler\*innen in einer anfänglichen Organisationsphase sich eigenständig ihre Aufgaben für die anstehende segeL-Stunde an ihren Platz holen. In der anschließenden Eigenarbeitsphase bearbeiten sie ohne externe Hilfe die ausgesuchten Aufgaben in Stillarbeit. Nach der Einzelarbeitsphase gibt es eine weitere, aber kürzere Organisationsphase, in der sich der/die Schüler\*in fertig bearbeitete Aufgaben wegräumen und ggf. neue Aufgabe besorgen kann. Anschließend findet eine Partner- oder Gruppenarbeitsphase statt, in denen die Schüler\*innen in Flüsterlautstärke sich über Fragen zu den Aufgaben austauschen dürfen. Zum Ende der Stunde folgt eine Dokumentationsphase, in der die Schüler\*innen ihre bearbeiteten Aufgaben in einem Dokumentationsheft festhalten.

Diese segeL-Uhr setzt analoge Uhren nun auf einem digitalen Wege um und schafft neue dynamischere Möglichkeiten. Sie sind Lehrer\*in und können die segeL-Stunde erst verspätet beginnen? Kein Problem, denn es gibt ein Phasenmodell, bei dem sie die Enduhrzeit der aktuellen Unterrichtsstunde auswählen und die segeL-Uhr berechnet Ihnen automatisch die Phasenzeiten, sodass zum Ende der Stunde alle Phasen vollständig durchlaufen sind. Sie können zudem vom Standardmodell abweichen und die Organisations- und Dokumentationsphasen kürzen oder ganz auslassen oder eine individuelle Länge der einzelnen Phasen vorgeben.

## Konfigurationsmöglichkeiten für Admins

über die Konfigurationsdatei können Sie zentrale Elemente der segeL-Uhr steuern. Dies beinhaltet:
- Angabe der Enduhrzeiten für skaliertes Phasenzeitenmodell
- Anzahl der Phasen (aktuell 4 oder 5 - wenn Sie 4 Phasen wählen, wird die Dokumentationsphase ausgelassen)
- Länge der Phasen (Standardmodell, Modell mit kurzen Organisations- und Dokumentationsphasen, Modell ohne Organisations- und Dokumentationsphasen)
- Name der Phasen
- Vordergrund-, Hintergrund- und Konturenfarbe der segeL-Uhr

Für die segeL-Uhr braucht es keine Datenbank oder Internetzugriffsrechte. Die einzigen eingebundenen Libraries (Chart.js und jQuery) sind lokal eingebunden.
