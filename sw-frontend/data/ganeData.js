import { useEffect, useState } from "react";
import team_logo_1 from "/public/images/team-logo-1.png";
import team_logo_10 from "/public/images/team-logo-10.png";
import team_logo_2 from "/public/images/team-logo-2.png";
import team_logo_3 from "/public/images/team-logo-3.png";
import team_logo_4 from "/public/images/team-logo-4.png";
import team_logo_5 from "/public/images/team-logo-5.png";
import team_logo_6 from "/public/images/team-logo-6.png";
import team_logo_7 from "/public/images/team-logo-7.png";
import team_logo_8 from "/public/images/team-logo-8.png";
import team_logo_9 from "/public/images/team-logo-9.png";
import { readContract } from "@wagmi/core";
import common from "@/components/common/common";
import { isAfter } from "date-fns";

const logoMap = {}
logoMap[1] = team_logo_1;
logoMap[2] = team_logo_2;
logoMap[3] = team_logo_3;
logoMap[4] = team_logo_4;
logoMap[5] = team_logo_5;
logoMap[6] = team_logo_6;
logoMap[7] = team_logo_7;
logoMap[8] = team_logo_8;
logoMap[9] = team_logo_9;
logoMap[10] = team_logo_10;

const gameData = [
  {
    id: 1,
    home: "Arsenal",
    away: "Volna",
    division: "Belarus",
    home_icon: team_logo_1,
    away_icon: team_logo_2,
  },
  {
    id: 2,
    home: "Apollon",
    away: "Paeek",
    division: "Cyprus",
    home_icon: team_logo_3,
    away_icon: team_logo_4,
  },
  {
    id: 3,
    home: "Raufoss",
    away: "Åsane",
    division: "Norway",
    home_icon: team_logo_5,
    away_icon: team_logo_6,
  },
  {
    id: 4,
    home: "Lida",
    away: "Paeek",
    division: "Cyprus",
    home_icon: team_logo_7,
    away_icon: team_logo_8,
  },
  {
    id: 5,
    home: "Sūduva",
    away: "Dainava",
    division: "Belarus",
    home_icon: team_logo_9,
    away_icon: team_logo_10,
  },
  {
    id: 6,
    home: "Eagle",
    away: "Paeek",
    division: "Belarus",
    home_icon: team_logo_2,
    away_icon: team_logo_4,
  },
];

export default gameData;
const abi = [{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    }
  ],
  "name": "findGameById",
  "outputs": [
    {
      "components": [
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "url",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "image",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "eventDate",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "datasource",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "internalType": "struct IStakeWiseWagerService.Games",
      "name": "game",
      "type": "tuple"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}];

export function useFetchGames() {
  const [data, setData] = useState([]);  
  
  async function read() {
    const data = [];
    for (let i = 0; i < 15; ++i) {
      const res = (await readContract({
        address: common.wager,
        abi: abi,
        functionName: "findGameById",
        args: [i + 1],
        chainId: 80001
      }));

      const ev = new Date(Number(res.eventDate) * 1000);
      if (isAfter(new Date(), ev)) {
        continue;
      }
      res.id = i + 1;
      res.home_icon = logoMap[(i + 1) % 10 + 1];
      res.away_icon = logoMap[(i + 2) % 10 + 1];

      const hw = res.description.split(" v ");

      res.home = hw[0];
      res.away = hw[1];

      console.log(res);
      data.push(res);
    }

    setData(data);
  }

  useEffect(() => {    
    read();
  }, []);

  return {data, read};
}

export function useFetchActiveGames() {

}