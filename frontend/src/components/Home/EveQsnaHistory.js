import React, {Component} from 'react';

export default class Home extends Component {
  render() {
    return (
      <article className="home">
        <h3 className="home__title">Welcome to Quantum Anomaly website</h3>

        <section className="home__intro">
          <p>Quantum Anomaly (QSNA) is an&nbsp;
            <a href="http://secure.eveonline.com/signup/?invc=ce57303e-b9f4-4d78-86ea-df33e1d853ca&action=buddy">
              EVE Online
            </a> &nbsp;corporation which was originally founded around begging of 2012. The QSNA ticker comes from
            Quantum Sentenced Nexus Anomaly, where Sentenced and Nexus are founding members of corporation.
            Since Sentenced was already part of Luna Sanguinem alliance, new formed corp joined into that alliance
            shortly after forming.
          </p>

          <p>QSNA members were quick to push alliance members to better forms of PVE, including incursions. As members
            of alliance we made lot's of ISK for our corporate and alliance pilots. Few months later alliance was wardeced
            and standing order was not to to fight. QSNA pilots wanted otherwise. After having some minor disagreement in teamspeak
            with alliance leadership, QSNA left alliance (on good terms).</p>

          <p>At this time Sentenced was active as incursion fleet commander for couple of years, starting with QSNA
            Incursions (2011), moving to UBET channel as one of the main FCs (2011-2012) and in some occasions ICU
            and ISN fleets (mostly as pilot and as an FC on few occasions). After a year, situation with
            UBET went bad after unknown 3rd party started wardecing corporations which were part of UBET channel. QSNA started&nbsp;
            <a href="https://www.youtube.com/watch?v=b2GK2e17xTs">The Incursion Guild</a>&nbsp;at around that time.
          </p>

          <p>TIG went to be very successful incursion channels for several years till if finally closed in 2017. We started with
            pirate battleship fleets, ran armor legions for 6 months and we were the first channel to fly exclusively Marauders for
            about a year (both shield and armor fits at same time due to dual OGB's). Later we switched to exclusively Vargur fleet.
            We had a good run for 5 years and honed our characters into perfect subcapital monsters.</p>

          <p>As corporation, we always had our base of operation in Highsec. Main reason for this is the fact that it is easier
            with lower number of people to do things. You need some ISK, you can easily do missions, you want some PVP, jump clone
            somewhere. If there is more poeple online, join up and do something. We did had our fair deal of PVP thanks to Bombers Bar,
            in which several pilots were active back from the days of camping HED-GP and killing THEST and AAA (who were always great sport).
            We remained active in Bombers bar also for several years. </p>

          <p>We also formed Quantum Syndicate channel for like minded people which has people from other alliances and corporation
            so that we can share experience and tips about the game. </p>

          <p>We tried few times to join some alliances, but always found them not to be exactly what we are looking for.
            We are still open for an alliance if we find terms that we like.</p>

          <p>Our moto has always been that quality is better than quantity and skills can be trained, personality can't.</p>
        </section>

        <aside className="home__images">
          <figure className="home__corp">
            <img className="home__image" src="https://image.eveonline.com/Corporation/98217943_128.png" alt="corp logo"/>
            <figcaption className="home__label">
              Quantum Anomaly<br/>
              Ticker: QSNA
            </figcaption>
          </figure>
          <figure className="home__corp">
            <img className="home__image" src="https://image.eveonline.com/Character/90178002_128.jpg" alt="corp logo"/>
            <figcaption className="home__label">
              Sentenced 1989<br/>
              CEO
            </figcaption>
          </figure>
          <figure className="home__corp">
            <img className="home__image" src="https://image.eveonline.com/Character/92311085_128.jpg" alt="corp logo"/>
            <figcaption className="home__label">
              Callsys<br/>
              Executive officer
            </figcaption>
          </figure>
        </aside>
      </article>
    );
  }
}
