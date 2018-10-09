import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import fetch from 'node-fetch';

import { Pokemon } from './models/Pokemon';
import { escapeJsonChars } from './utils/string';

export const pokedex: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  try {
    console.log(event.body);

    const paramDict: any = {};

    // parse parameters
    const paramList = event.body.split('&');
    for (let i = 0; i < paramList.length; i = i + 1) {
      const element = paramList[i];
      const pieces = element.split('=');
      paramDict[pieces[0]] = pieces[1];
    }

    const command = paramDict.command;
    const commandText = paramDict.text;

    const url = `https://pokeapi.co/api/v2/pokemon/${commandText}`;

    const result: Pokemon = await fetch(url).then(r => r.json());

    const message = {
      'response_type': 'in_channel',
      text: 'Found your pokemon!',
      attachments: [{
        image_url: result.sprites.front_default,
        fields: [{
          title: 'id',
          value: result.id,
        }, {
          title: 'name',
          value: result.name,
        }],
      }, {
        text: escapeJsonChars(JSON.stringify(result, null, 2)),
      }],
    };

    const response = {
      statusCode: 200,
      body: JSON.stringify(message),
      cache
    };

    cb(null, response);
  } catch (err) {
    cb(err);
  }
};
