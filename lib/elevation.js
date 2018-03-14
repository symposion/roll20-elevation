'use strict';

const Roll20 = require('roll20-wrapper');
const _ = require('underscore');


const roll20 = new Roll20();
const myState = roll20.getState('Elevation');
let currentLevel = 0;
let defining = false;
myState.defs = myState.defs || {};


roll20.logWrap = 'roll20';

function registerHandlers() {
  roll20.on('chat:message', (msg) => {
    if (msg.type === 'api' && msg.content.startsWith('!elevation')) {
      const cmd = msg.content.split('-')[1];
      currentLevel = parseInt(cmd.split(/\s/)[1], 10);
      defining = cmd.startsWith('define');
      const pageId = roll20.getObj('player', msg.playerid).get('lastpage');
      if (defining) {
        myState.defs[pageId] = myState.defs[pageId] || [];
        myState.defs[pageId][currentLevel] = myState.defs[pageId][currentLevel] || {
          mapGraphicIds: [],
          dlGraphicIds: [],
        };
      }
      else {
        _.each(myState.defs[pageId], (graphicDetails, elevationLevel) => {

          graphicDetails.mapGraphicIds = graphicDetails.mapGraphicIds.filter((id) => {
            const graphic = roll20.getObj('graphic', id);
            if (graphic) {
              graphic.set('layer', currentLevel === elevationLevel ? 'map' : 'gmlayer');
              return true;
            }
            return false;
          });
          graphicDetails.dlGraphicIds = graphicDetails.dlGraphicIds.filter((id) => {
            const path = roll20.getObj('path', id);
            if (path) {
              path.set('layer', currentLevel === elevationLevel ? 'walls' : 'gmlayer');
              return true;
            }
            return false;
          });
        });
      }
    }
  });

  roll20.on('add:graphic', (graphic) => {
    if(!defining || graphic.get('layer') !== 'map') return;

    const pageId = graphic.get('pageid');
    myState.defs[pageId][currentLevel].mapGraphicIds.push(graphic.id);

  });

  roll20.on('add:path', (path) => {
    if(!defining || path.get('layer') !== 'walls') return;

    const pageId = path.get('pageid');
    myState.defs[pageId][currentLevel].dlGraphicIds.push(path.id);
  });
}

roll20.on('ready', registerHandlers);