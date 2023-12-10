import Image from "next/image";
import first_trophy from "/public/images/icon/first-trophy.png";
import second_trophy from "/public/images/icon/second-trophy.png";
import third_trophy from "/public/images/icon/third-trophy.png";

const TournamentTable = () => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Nickname</th>
          <th scope="col">Profit</th>
          <th scope="col">Total Bets</th>
          <th scope="col">Prize Money</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">
            <Image src={first_trophy} alt="icon" />
          </th>
          <td>Erik Curry</td>
          <td>$8,870</td>
          <td>81</td>
          <td className="prize">$400.00</td>
        </tr>
        <tr>
          <th scope="row">
            <Image src={second_trophy} alt="icon" />
          </th>
          <td>Erik Curry</td>
          <td>$8,370</td>
          <td>14</td>
          <td className="prize">$250.00</td>
        </tr>
        <tr>
          <th scope="row">
            <Image src={third_trophy} alt="icon" />
          </th>
          <td>Erik Curry</td>
          <td>$3,937</td>
          <td>70</td>
          <td className="prize">$200.00</td>
        </tr>
        <tr>
          <th scope="row">04</th>
          <td>Lewash17</td>
          <td>$1,408</td>
          <td>6</td>
          <td className="prize">$175.00</td>
        </tr>
        <tr>
          <th scope="row">05</th>
          <td>Gromph</td>
          <td>$1,371</td>
          <td>11</td>
          <td className="prize">$150.00</td>
        </tr>
        <tr>
          <th scope="row">06</th>
          <td>jaja27</td>
          <td>$1,370</td>
          <td>15</td>
          <td className="prize">$125.00</td>
        </tr>
        <tr>
          <th scope="row">07</th>
          <td>phorbes</td>
          <td>$977</td>
          <td>4</td>
          <td className="prize">$115.00</td>
        </tr>
        <tr>
          <th scope="row">08</th>
          <td>saarben</td>
          <td>$805</td>
          <td>37</td>
          <td className="prize">$100.00</td>
        </tr>
        <tr>
          <th scope="row">09</th>
          <td>utilityman</td>
          <td>$759</td>
          <td>162</td>
          <td className="prize">$90.00</td>
        </tr>
        <tr>
          <th scope="row">10</th>
          <td>Fortza</td>
          <td>$320</td>
          <td>37</td>
          <td className="prize">$80.00</td>
        </tr>
        <tr>
          <th scope="row">11</th>
          <td>richo</td>
          <td>$244</td>
          <td>33</td>
          <td className="prize">$70.00</td>
        </tr>
        <tr>
          <th scope="row">12</th>
          <td>Fatpat</td>
          <td>$223</td>
          <td>11</td>
          <td className="prize">$60.00</td>
        </tr>
        <tr>
          <th scope="row">13</th>
          <td>Rhawkins</td>
          <td>$167</td>
          <td>19</td>
          <td className="prize">$50.00</td>
        </tr>
        <tr>
          <th scope="row">14</th>
          <td>ddkhen</td>
          <td>$160</td>
          <td>8</td>
          <td className="prize">$40.00</td>
        </tr>
        <tr>
          <th scope="row">15</th>
          <td>goku777</td>
          <td>$140</td>
          <td>0</td>
          <td className="prize">$30.00</td>
        </tr>
        <tr>
          <th scope="row">16</th>
          <td>Bazzo</td>
          <td>$84</td>
          <td>0</td>
          <td className="prize">$25.00</td>
        </tr>
        <tr>
          <th scope="row">17</th>
          <td>Eskimo</td>
          <td>$57</td>
          <td>51</td>
          <td className="prize">$20.00</td>
        </tr>
        <tr>
          <th scope="row">18</th>
          <td>Brad Mills</td>
          <td>$49</td>
          <td>0</td>
          <td className="prize">$15.00</td>
        </tr>
        <tr>
          <th scope="row">19</th>
          <td>Cary Bass</td>
          <td>$42</td>
          <td>84</td>
          <td className="prize">$10.00</td>
        </tr>
        <tr>
          <th scope="row">20</th>
          <td>David Rowe</td>
          <td>$40</td>
          <td>2</td>
          <td className="prize">$5.00</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TournamentTable;
