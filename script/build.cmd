del ..\contribution.xml /q

REM Build Viz Databound contribution.xml files
call build_viz.cmd

REM Build the rest as normal
type ..\templates.main\contribution.xml.head.txt ^
..\templates\contribution.xml.head.txt ^
..\templates.main\eula.xml.txt ^
..\templates.main\license.xml.txt ^
..\templates\contribution.xml.groups.txt ^
..\res\BeatChart\def\contribution.xml ^
..\res\Chart3\def\contribution.xml ^
..\res\ColoredBox\def\contribution.xml ^
..\templates.main\contribution.xml.close.txt > ^
..\contribution.xml

del ..\contribution.ztl /q

type ..\templates.main\contribution.ztl.head.txt ^
..\templates\contribution.ztl.head.txt ^
..\templates.main\license.js.txt ^
..\res\BeatChart\def\contribution.ztl ^
..\res\Chart3\def\contribution.ztl ^
..\res\ColoredBox\def\contribution.ztl ^
..\templates.main\contribution.ztl.close.txt > ^
..\contribution.ztl

del ..\META-INF\MANIFEST.MF /q

type ..\templates.main\MANIFEST.MF ^
..\templates\MANIFEST.MF > ^
..\META-INF\MANIFEST.MF
