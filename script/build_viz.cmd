del .\vizDefs\Core.generated.xml
del .\vizDefs\Databound.generated.xml
del .\vizDefs\BaseViz.generated.xml
del .\vizDefs\BaseVizXY.generated.xml
del .\vizDefs\AxisChart.generated.xml
del .\vizDefs\Map.generated.xml

type .\vizDefs\Core.properties.xml > .\vizDefs\Core.generated.xml
type .\vizDefs\Core.generated.xml .\vizDefs\Databound.properties.xml > .\vizDefs\Databound.generated.xml
type .\vizDefs\Databound.generated.xml .\vizDefs\BaseViz.properties.xml > .\vizDefs\BaseViz.generated.xml
type .\vizDefs\BaseViz.generated.xml .\vizDefs\AxisChart.properties.xml > .\vizDefs\AxisChart.generated.xml
type .\vizDefs\BaseViz.generated.xml .\vizDefs\BaseVizXY.properties.xml > .\vizDefs\BaseVizXY.generated.xml
type .\vizDefs\BaseViz.generated.xml .\vizDefs\Map.properties.xml > .\vizDefs\Map.generated.xml

type .\vizDefs\Core.defaults.xml > .\vizDefs\Core.defaults.generated.xml
type .\vizDefs\Core.defaults.generated.xml .\vizDefs\Databound.defaults.xml > .\vizDefs\Databound.defaults.generated.xml
type .\vizDefs\Databound.defaults.generated.xml .\vizDefs\BaseViz.defaults.xml > .\vizDefs\BaseViz.defaults.generated.xml
type .\vizDefs\BaseViz.defaults.generated.xml .\vizDefs\AxisChart.defaults.xml > .\vizDefs\AxisChart.defaults.generated.xml
type .\vizDefs\BaseViz.defaults.generated.xml .\vizDefs\BaseVizXY.defaults.xml > .\vizDefs\BaseVizXY.defaults.generated.xml
type .\vizDefs\BaseViz.defaults.generated.xml .\vizDefs\Map.defaults.xml > .\vizDefs\Map.defaults.generated.xml

del ..\res\BeatChart\def\contribution.xml
type ..\res\BeatChart\def\header.xml ^
.\vizDefs\Databound.generated.xml ^
..\res\BeatChart\def\properties.xml ^
.\vizDefs\InitializationHeader.xml ^
.\vizDefs\Databound.defaults.generated.xml ^
..\res\BeatChart\def\defaults.xml ^
.\vizDefs\Footer.xml > ^
..\res\BeatChart\def\contribution.xml

del ..\res\Chart3\def\contribution.xml
type ..\res\Chart3\def\header.xml ^
..\res\Chart3\def\properties.xml ^
.\vizDefs\InitializationHeader.xml ^
..\res\Chart3\def\defaults.xml ^
.\vizDefs\Footer.xml > ^
..\res\Chart3\def\contribution.xml

del ..\res\ColoredBox\def\contribution.xml
type ..\res\ColoredBox\def\header.xml ^
..\res\ColoredBox\def\properties.xml ^
.\vizDefs\InitializationHeader.xml ^
..\res\ColoredBox\def\defaults.xml ^
.\vizDefs\Footer.xml > ^
..\res\ColoredBox\def\contribution.xml

