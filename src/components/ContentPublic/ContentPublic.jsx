import "./ContentPublic.css";
import { assets } from "../../assets/assets";

const ContentPublic = () => {
  return (
    <div className="content-public">
      <div className="title-public">
        <h1>Simplified Event Scheduling</h1>
        <p>
          Calendo offers seamless event management and an easy way to explore
          all the coolest events. Say goodbye to chaos and hello to organized,
          enjoyable planning.
        </p>
      </div>
      <div>
        <img
          className="content-public-img"
          src={assets.publicHeader}
          alt="demo"
        />
      </div>
      <div className="partners">
        <h3>Simplified scheduling for more than 20 million users worldwide</h3>
        <div id='container-scroll'>
          <div className='scroll'>
            <div className='item'><img src={assets.company1}></img></div>
            <div className='item'><img src={assets.company2}></img></div>
            <div className='item'><img src={assets.company3}></img></div>
            <div className='item'><img src={assets.company4}></img></div>
            <div className='item'><img src={assets.company1}></img></div>
            <div className='item'><img src={assets.company5}></img></div>
            <div className='item'><img src={assets.company6}></img></div>
            <div className='item'><img src={assets.company7}></img></div>
            <div className='item'><img src={assets.company8}></img></div>
            <div className='item'><img src={assets.company9}></img></div>
            <div className='item'><img src={assets.company10}></img></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPublic;
