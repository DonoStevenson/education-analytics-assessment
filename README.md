# Education Analytics Assessment
### by Donovan Stevenson

## Overview
A small page listing yearly information on admissions scores, demographics, program percentages and tuition/cost information for UW-Madison.
Built using Node and React. Graphs built using Plotly-react.

## Instructions
1. Clone Repository
2. CD into backend directory and run
```
npm install
```
3. Repeat Step 2 in client directory
4. CD into backend and run 
```
node server.js
```
5. CD into client directory and run
```
npm start
```

## Usage
Use slider to adjust the year for information shown.
Charts are displayed using a carousel, click the shaded regions to move to the next set of graphs.
Buttons located at bottom of page to print page, Download as PDF, and export the selected years data to csv.
## Bug
There is a small bug in the Tuition table,
moving the slider fixes this but occassionally the hardcoded information disappears. 
